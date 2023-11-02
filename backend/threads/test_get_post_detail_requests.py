import pytest
from django.test import Client

from .models import Post


def url(post_id: int) -> str:
    return f"/api/threads/posts/{post_id}/"


@pytest.mark.django_db
def test_returns_200(client: Client, post: Post):
    response = client.get(url(post.id))
    assert response.status_code == 200


@pytest.mark.django_db
def test_can_fetch_post_when_deleted(client: Client, post: Post):
    post_id = post.id
    post.delete()
    response = client.get(url(post_id))
    assert response.status_code == 200
