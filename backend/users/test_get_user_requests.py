import pytest
from rest_framework.test import APIClient

from .models import User
from .serializers import UserSerializer


def make_request(client: APIClient, user: User):
    return client.get(f"/be/users/users/{user.id}/")


@pytest.mark.django_db
def test_get_user_returns_200(client: APIClient, user: User):
    response = make_request(client, user)
    assert response.status_code == 200


@pytest.mark.django_db
def test_get_user_returns_user(client: APIClient, user: User):
    response = make_request(client, user)
    assert response.data == UserSerializer(user).data
