import pytest
from rest_framework.test import APIClient

from .models import User
from .serializers import AccountSerializer


@pytest.fixture
def props(user: User):
    return {"username": user.username, "password": user.password}


def make_request(client: APIClient, props: dict):
    return client.post("/api/users/token/", props)


@pytest.mark.django_db
def test_returns_200(client: APIClient, props: dict):
    response = make_request(client, props)
    assert response.status_code == 200


@pytest.mark.django_db
def test_returns_account_and_token(client: APIClient, props: dict):
    response = make_request(client, props)
    data = {**response.data}
    assert type(data["token"]) is str
    del data["token"]
    user = User.objects.last()
    assert data == AccountSerializer(user).data


@pytest.mark.django_db
def test_returns_400_when_invalid(client: APIClient, props: dict):
    props["password"] += " and more"
    response = make_request(client, props)
    assert response.status_code == 400


@pytest.mark.django_db
def test_returns_400_if_no_such_user(
    client: APIClient, user: User, props: dict
):
    User.objects.filter(id=user.id).delete()
    response = make_request(client, props)
    assert response.status_code == 400


@pytest.mark.django_db
def test_returns_400_if_user_is_deleted(
    client: APIClient, user: User, props: dict
):
    user.is_active = False
    user.save()
    response = make_request(client, props)
    assert response.status_code == 400
