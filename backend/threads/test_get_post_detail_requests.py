import pytest
from django.test import Client

from .models import Post


@pytest.mark.django_db
def test_post_detail_returns_200(client: Client, post: Post):
    response = client.get(f"/api/threads/posts/{post.id}/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_post_detail_returns_404_when_missing(client: Client, post: Post):
    post_id = post.id
    post.delete()
    response = client.get(f"/api/threads/posts/{post_id}/")
    assert response.status_code == 404
