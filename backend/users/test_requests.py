import pytest
from django.test import Client
from faker import Faker

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
    response = client.post("/api/users/", register_props)
    assert response.status_code == 200


@pytest.mark.django_db
def test_register_returns_400_when_invalid(
    client: Client, register_props: dict
):
    del register_props["username"]
    response = client.post("/api/users/", register_props)
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
def test_get_user_returns_200(client: Client, user: User):
    response = client.get(f"/api/users/{user.id}/")
    assert response.status_code == 200
