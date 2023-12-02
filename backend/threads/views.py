import os
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import mixins, views, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from threads import policies
from .models import Post, Reaction, Reply, Tag
from .serializers import PostSerializer, ReactionSerializer, ReplySerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [policies.PostAccessPolicy]

    def get_queryset(self):
        queryset = Post.objects.all()
        queryset = queryset.select_related("author")
        queryset = queryset.prefetch_related("reactions", "replies", "tags")

        if authors := self.request.query_params.getlist("author"):
            queryset = queryset.filter(author__id__in=authors)

        if tags := self.request.query_params.getlist("tag"):
            queryset = queryset.filter(tags__name__in=tags)

        if self.action == "list":
            queryset = queryset.filter(is_deleted=False)

        return queryset

    def _ensure_tags(self, post: Post, tags: list[str]):
        new_tags = set(tag.strip() for tag in tags if tag.strip())

        Tag.objects.filter(post=post).exclude(name__in=tags).delete()

        for tag in new_tags:
            Tag.objects.get_or_create(post=post, name=tag)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.save(author=self.request.user)
        self._ensure_tags(post, request.data["tags"])

        return Response(serializer.data, status=201)

    def perform_update(self, serializer):
        post = serializer.save()
        self._ensure_tags(post, self.request.data["tags"])

    def retrieve(self, request, pk):
        post = get_object_or_404(self.get_queryset().filter(pk=pk))
        serializer = self.serializer_class(post)
        user_reaction = post.reactions.filter(user_id=request.user.id).first()
        user_reaction_type = user_reaction.type if user_reaction else None

        return Response(
            {**serializer.data, "user_reaction_type": user_reaction_type}
        )


class ReplyViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    permission_classes = [policies.ReplyAccessPolicy]

    def get_queryset(self):
        return Reply.objects.filter(post=self.kwargs["post_pk"])

    def perform_create(self, serializer):
        post_id = int(self.kwargs["post_pk"])

        if not Post.objects.filter(id=post_id).exists():
            raise Http404

        serializer.save(author=self.request.user, post_id=post_id)

    def perform_update(self, serializer):
        if not Reply.objects.filter(pk=self.kwargs["pk"]).exists():
            raise Http404
        post_id = int(self.kwargs["post_pk"])
        serializer.save(author=self.request.user, post_id=post_id)

    def destroy(self, request, post_pk, pk):
        Reply.objects.filter(pk=pk).delete()
        return Response(status=204)

    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            if self.action == "destroy":
                return None


class PostReactionViewSet(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Reaction.objects.all()
    serializer_class = ReactionSerializer
    permission_classes = [policies.PostReactionAccessPolicy]

    def perform_create(self, serializer):
        post_id = int(self.kwargs["post_pk"])
        post = Post.objects.get(id=post_id)
        post.reactions.filter(user=self.request.user).delete()
        serializer.save(user=self.request.user, content=post)


class DeletePostReaction(views.APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, type):
        post = ContentType.objects.get_for_model(Post)
        Reaction.objects.filter(
            content_type=post, object_id=pk, type=type
        ).delete()

        return Response(status=204)


class GetFilters(views.APIView):
    def get(self, request):
        filters = {"authors": [], "tags": []}

        if not request.user.is_authenticated:
            email = os.environ["DEFAULT_AUTHOR_EMAIL"]
            author = get_user_model().objects.filter(email=email).first()
            if author:
                filters["authors"].append(author.id)

        return Response(filters)
