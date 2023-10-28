import pytest
from django.test import Client

from .models import Post


@pytest.mark.django_db
def test_get_post_replies_returns_200(client: Client, post: Post):
    response = client.get(f"/api/threads/posts/{post.id}/replies/")
    assert response.status_code == 200
