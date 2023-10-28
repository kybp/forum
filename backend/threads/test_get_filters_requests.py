import os
import pytest
from django.test import Client
from rest_framework.test import APIClient

from users.models import User


@pytest.mark.django_db
def test_get_filters_when_signed_returns_200(client: Client):
    response = client.get("/api/threads/filters/")

    assert response.status_code == 200


@pytest.mark.django_db
def test_get_filters_when_signed_in_returns_200(user_client: APIClient):
    response = user_client.get("/api/threads/filters/")

    assert response.status_code == 200


@pytest.mark.django_db
def test_get_filters_when_signed_out_returns_default_author(client: Client):
    email = os.environ["DEFAULT_AUTHOR_EMAIL"]
    user = User.objects.create(email=email)

    response = client.get("/api/threads/filters/")

    assert user.id in response.json()["authors"]


@pytest.mark.django_db
def test_get_filters_when_signed_in_returns_empty(user_client: APIClient):
    response = user_client.get("/api/threads/filters/")

    assert response.json() == {
        "authors": [],
        "tags": [],
    }
