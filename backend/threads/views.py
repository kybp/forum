from django.contrib.contenttypes.models import ContentType
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import mixins, views, viewsets
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.response import Response

from .models import Post, Reaction, Reply, Tag
from .serializers import PostSerializer, ReactionSerializer, ReplySerializer


class PostViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Post.objects.all().prefetch_related("replies")
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def _create_tags(self, post: Post, tags: list[str]):
        for tag in set(tag.strip() for tag in tags if tag.strip()):
            Tag.objects.create(post=post, name=tag)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.save(author=self.request.user)
        self._create_tags(post, request.data["tags"])

        return Response(serializer.data, status=201)

    def retrieve(self, request, pk):
        post = get_object_or_404(self.queryset.filter(pk=pk))
        serializer = self.serializer_class(post)
        user_reaction = post.reactions.filter(user_id=request.user.id).first()
        user_reaction_type = user_reaction.type if user_reaction else None

        return Response(
            {**serializer.data, "user_reaction_type": user_reaction_type}
        )


class ReplyViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Reply.objects.filter(post=self.kwargs["post_pk"])

    def perform_create(self, serializer):
        post_id = int(self.kwargs["post_pk"])

        if not Post.objects.filter(id=post_id).exists():
            raise Http404

        serializer.save(author=self.request.user, post_id=int(post_id))


class PostReactionViewSet(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Reaction.objects.all()
    serializer_class = ReactionSerializer
    permission_classes = [IsAuthenticated]

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
