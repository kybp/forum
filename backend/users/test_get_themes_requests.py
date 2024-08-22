import pytest
from rest_framework.test import APIClient

from .models import User


def make_request(client: APIClient):
    return client.get("/be/users/themes/")


@pytest.mark.django_db
def test_returns_200(client: APIClient):
    response = make_request(client)
    assert response.status_code == 200


@pytest.mark.django_db
def test_returns_list_of_themes(client: APIClient):
    response = make_request(client)
    assert len(response.data) == len(User.Theme.choices)
    assert set(response.data) == set(theme for theme, _ in User.Theme.choices)
