import pytest
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from .factories import UserFactory
from .models import User


@pytest.mark.django_db
def test_returns_204(user_client: APIClient, user: User):
    response = user_client.delete(f"/api/users/accounts/{user.id}/")
    assert response.status_code == 204


@pytest.mark.django_db
def test_marks_user_deleted(user_client: APIClient, user: User):
    user_client.delete(f"/api/users/accounts/{user.id}/")
    user.refresh_from_db()
    assert user.is_active is False


@pytest.mark.django_db
def test_deletes_token(user_client: APIClient, user: User):
    Token.objects.get_or_create(user=user)
    user_client.delete(f"/api/users/accounts/{user.id}/")
    assert not Token.objects.filter(user=user).exists()


@pytest.mark.django_db
def test_returns_401_for_anonymous_user(client: APIClient, user: User):
    response = client.delete(f"/api/users/accounts/{user.id}/")
    assert response.status_code == 401


@pytest.mark.django_db
def test_returns_403_for_other_user(user_client: APIClient):
    other_user = UserFactory()
    response = user_client.delete(f"/api/users/accounts/{other_user.id}/")
    assert response.status_code == 403
