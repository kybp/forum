import pytest
from django.test import Client
from faker import Faker
from rest_framework.authtoken.models import Token

from .factories import UserFactory
from .models import User

fake = Faker()


@pytest.fixture
def register_props():
    return {
        "username": fake.email(),
        "email": fake.email(),
        "password": fake.password(),
    }


@pytest.mark.django_db
def test_register_returns_200(client: Client, register_props: dict):
    response = client.post("/api/users/accounts/", register_props)
    assert response.status_code == 200


@pytest.mark.django_db
def test_register_returns_400_when_invalid(
    client: Client, register_props: dict
):
    del register_props["username"]
    response = client.post("/api/users/accounts/", register_props)
    assert response.status_code == 400


@pytest.mark.django_db
def test_sign_in_returns_200(client: Client, user: User):
    response = client.post(
        "/api/users/token/",
        {"username": user.username, "password": user.password},
    )
    assert response.status_code == 200


@pytest.mark.django_db
def test_sign_in_returns_400_when_invalid(client: Client, user: User):
    response = client.post(
        "/api/users/token/",
        {"username": user.username, "password": user.password + "x"},
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_sign_in_returns_400_if_no_such_user(client: Client, user: User):
    user.delete()
    response = client.post(
        "/api/users/token/",
        {"username": user.username, "password": user.password},
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_sign_in_returns_400_if_user_is_deleted(client: Client, user: User):
    user.is_active = False
    user.save()

    response = client.post(
        "/api/users/token/",
        {"username": user.username, "password": user.password},
    )

    assert response.status_code == 400


@pytest.mark.django_db
def test_get_user_returns_200(client: Client, user: User):
    response = client.get(f"/api/users/accounts/{user.id}/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_delete_user_returns_204(user_client: Client, user: User):
    response = user_client.delete(f"/api/users/accounts/{user.id}/")
    assert response.status_code == 204


@pytest.mark.django_db
def test_delete_user_marks_user_deleted(user_client: Client, user: User):
    user_client.delete(f"/api/users/accounts/{user.id}/")
    user.refresh_from_db()
    assert user.is_active is False


@pytest.mark.django_db
def test_delete_user_deletes_token(user_client: Client, user: User):
    Token.objects.get_or_create(user=user)
    user_client.delete(f"/api/users/accounts/{user.id}/")
    assert not Token.objects.filter(user=user).exists()


@pytest.mark.django_db
def test_delete_user_returns_401_for_anonymous_user(
    client: Client, user: User
):
    response = client.delete(f"/api/users/accounts/{user.id}/")
    assert response.status_code == 401


@pytest.mark.django_db
def test_delete_user_returns_403_for_other_user(user_client: Client):
    other_user = UserFactory()
    response = user_client.delete(f"/api/users/accounts/{other_user.id}/")
    assert response.status_code == 403
