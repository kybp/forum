from rest_framework import serializers
from typing import Any

from .models import Post


class PostSerializer(serializers.ModelSerializer):
    author_id: Any = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault(),
    )

    class Meta:
        model = Post
        fields = ["id", "author_id", "title", "body", "date_posted"]

    def create(self, serializer):
        author_id = self.data["author_id"]
        return Post.objects.create(**self.validated_data, author_id=author_id)
