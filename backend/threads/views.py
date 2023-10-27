from django.http import Http404
from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Post, Reply
from .serializers import PostSerializer, ReplySerializer


class PostViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Post.objects.all().prefetch_related("replies")
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return []
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ReplyViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer

    def get_queryset(self):
        return Reply.objects.filter(post=self.kwargs["post_pk"])

    def get_permissions(self):
        if self.action in ["list"]:
            return []
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        post_id = int(self.kwargs["post_pk"])

        if not Post.objects.filter(id=post_id).exists():
            raise Http404

        serializer.save(author=self.request.user, post_id=int(post_id))
