import pytest
from faker import Faker
from rest_framework.test import APIClient

from .models import User
from .serializers import AccountSerializer

fake = Faker()


@pytest.fixture
def props():
    return {
        "username": fake.email(),
        "email": fake.email(),
        "password": fake.password(),
    }


@pytest.mark.django_db
def test_returns_201(client: APIClient, props: dict):
    response = client.post("/be/users/accounts/", props)
    assert response.status_code == 201


@pytest.mark.django_db
def test_returns_account_and_token(client: APIClient, props: dict):
    response = client.post("/be/users/accounts/", props)
    data = {**response.data}
    assert type(data["token"]) is str
    del data["token"]
    user = User.objects.last()
    assert data == AccountSerializer(user).data


@pytest.mark.django_db
def test_returns_400_when_invalid(client: APIClient, props: dict):
    del props["username"]
    response = client.post("/be/users/accounts/", props)
    assert response.status_code == 400
