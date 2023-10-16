from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer


class CreateUserView(APIView):
    def post(self, request):
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


class ObtainAuthTokenView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        user = self._get_user(request)
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
