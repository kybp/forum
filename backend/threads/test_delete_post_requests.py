import pytest
from django.test import Client
from rest_framework.test import APIClient

from users.factories import UserFactory
from .models import Post


def url(post_id: int):
    return f"/be/threads/posts/{post_id}/"


@pytest.mark.django_db
def test_returns_204(user_client: APIClient, post: Post):
    response = user_client.delete(url(post.id))
    assert response.status_code == 204


@pytest.mark.django_db
def test_deletes_the_object(user_client: APIClient, post: Post):
    user_client.delete(url(post.id))
    post.refresh_from_db()
    assert post.is_deleted


@pytest.mark.django_db
def test_returns_204_when_post_does_not_exist(
    user_client: APIClient, post: Post
):
    post_id = post.id
    post.delete()

    response = user_client.delete(url(post_id))

    assert response.status_code == 204


@pytest.mark.django_db
def test_returns_401_when_not_authenticated(client: Client, post: Post):
    response = client.delete(url(post.id))
    assert response.status_code == 401


@pytest.mark.django_db
def test_returns_403_for_other_user(user_client: APIClient, post: Post):
    post.author = UserFactory()
    post.save()
    response = user_client.delete(url(post.id))
    assert response.status_code == 403
