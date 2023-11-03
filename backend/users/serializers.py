from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """A serializer suitable for showing users to other users."""

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "avatar",
        )

    def to_representation(self, user):
        result = super().to_representation(user)

        if not user.is_active:
            result["username"] = "[deleted]"
            result["avatar"] = ""

        return result


class AccountSerializer(serializers.ModelSerializer):
    """A serializer that includes account settings and private info."""

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "password",
            "email",
            "avatar",
        )

    password = serializers.CharField(write_only=True)

    def validate_username(self, username):
        reserved_names = {"[deleted]"}

        if username not in reserved_names:
            return username

    def create(self, data):
        return get_user_model().objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
        )
