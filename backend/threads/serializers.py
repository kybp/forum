from django.contrib.auth import get_user_model
from rest_framework import serializers
from typing import Any

from .models import Post, Reply

User = get_user_model()


class ReplySerializer(serializers.ModelSerializer):
    author: Any = serializers.PrimaryKeyRelatedField(read_only=True)
    post: Any = serializers.PrimaryKeyRelatedField(
        required=True, queryset=Post.objects.all()
    )

    class Meta:
        model = Reply
        fields = ["id", "author", "post", "body", "date_posted"]


class PostSerializer(serializers.ModelSerializer):
    author_id: Any = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault(),
    )

    replies: Any = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True
    )

    class Meta:
        model = Post
        fields = [
            "id",
            "author_id",
            "title",
            "body",
            "date_posted",
            "replies",
        ]

    def create(self, serializer):
        author_id = self.data["author_id"]
        return Post.objects.create(**self.validated_data, author_id=author_id)
