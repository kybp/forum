import pytest
from rest_framework.test import APIClient

from .factories import UserFactory
from .models import User
from .serializers import AccountSerializer


def make_request(client: APIClient, user: User, props: dict):
    return client.patch(f"/api/users/accounts/{user.id}/", props)


@pytest.mark.django_db
def test_returns_200(user_client: APIClient, user: User):
    response = make_request(user_client, user, {})
    assert response.status_code == 200


@pytest.mark.django_db
def test_returns_401_when_not_signed_in(client: APIClient, user: User):
    response = make_request(client, user, {})
    assert response.status_code == 401


@pytest.mark.django_db
def test_returns_403_for_other_user(user_client: APIClient):
    other_user = UserFactory()
    response = make_request(user_client, other_user, {})
    assert response.status_code == 403


@pytest.mark.django_db
def test_returns_updated_user(user_client: APIClient, user: User):
    original_data = {**AccountSerializer(user).data}
    response = make_request(user_client, user, {"theme": "dark"})
    user.refresh_from_db()
    assert response.data != original_data
    assert response.data == AccountSerializer(user).data


@pytest.mark.django_db
def test_can_update_theme(user_client: APIClient, user: User):
    old_theme, new_theme = "light", "dark"
    user.theme = old_theme
    user.save()

    make_request(user_client, user, {"theme": new_theme})

    user.refresh_from_db()
    assert user.theme == new_theme
