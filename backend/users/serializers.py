from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, data):
        return get_user_model().objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
        )

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "password",
        )
