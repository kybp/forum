from rest_framework import mixins, viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from users import policies
from .models import User
from .serializers import UserSerializer


class UserViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [policies.UserAccessPolicy]

    def create(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = Token.objects.create(user=user)

        return Response(
            {
                **serializer.data,
                "token": token.key,
            }
        )

    def perform_destroy(self, user):
        user.is_active = False
        user.save()
        Token.objects.filter(user=user).delete()


class ObtainAuthTokenView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        user = self._get_user(request)

        if not user.is_active:
            return Response(
                {
                    "non_field_errors": [
                        "Unable to log in with provided credentials."
                    ],
                },
                status=400,
            )

        serializer = UserSerializer(user)
        token, _created = Token.objects.get_or_create(user=user)

        return Response(
            {
                **serializer.data,
                "token": token.key,
            }
        )

    def _get_user(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data["user"]
