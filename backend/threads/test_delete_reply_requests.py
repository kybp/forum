import pytest
from django.test import Client
from rest_framework.test import APIClient

from users.factories import UserFactory
from .models import Reply


def url(post_id: int, reply_id: int):
    return f"/be/threads/posts/{post_id}/replies/{reply_id}/"


@pytest.mark.django_db
def test_returns_204(user_client: APIClient, reply: Reply):
    response = user_client.delete(url(reply.post_id, reply.id))
    assert response.status_code == 204


@pytest.mark.django_db
def test_deletes_the_object(user_client: APIClient, reply: Reply):
    user_client.delete(url(reply.post_id, reply.id))
    assert not Reply.objects.filter(id=reply.id).exists()


@pytest.mark.django_db
def test_returns_204_when_reply_does_not_exist(
    user_client: APIClient, reply: Reply
):
    reply_id = reply.id
    reply.delete()

    response = user_client.delete(url(reply.post_id, reply_id))

    assert response.status_code == 204


@pytest.mark.django_db
def test_returns_401_when_not_authenticated(client: Client, reply: Reply):
    response = client.delete(url(reply.post_id, reply.id))
    assert response.status_code == 401


@pytest.mark.django_db
def test_returns_403_for_other_user(user_client: APIClient, reply: Reply):
    reply.author = UserFactory()
    reply.save()
    response = user_client.delete(url(reply.post_id, reply.id))
    assert response.status_code == 403
