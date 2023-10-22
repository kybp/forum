from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Post, Reply
from .serializers import PostSerializer, ReplySerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().prefetch_related("replies")
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return []
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Load newly created instance
        serializer = self.get_serializer(serializer.save())
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer

    def get_permissions(self):
        if self.action in ["retrieve"]:
            return []
        return [IsAuthenticated()]

    def create(self, request):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)

        return Response(serializer.data)


class GetPostReplies(APIView):
    def get(self, request, pk):
        replies = Reply.objects.filter(post=pk).all()
        serializer = ReplySerializer(replies, many=True)
        return Response(serializer.data)
