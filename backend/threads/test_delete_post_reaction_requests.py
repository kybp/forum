import pytest
from django.test import Client
from rest_framework.test import APIClient

from users.models import User
from .models import Post, Reaction


@pytest.mark.django_db
def test_delete_post_reaction_returns_204(user_client: APIClient, post: Post):
    response = user_client.delete(
        f"/be/threads/posts/{post.id}/reactions/like/",
    )

    assert response.status_code == 204


@pytest.mark.django_db
def test_delete_post_reaction_deletes_the_object(
    user_client: APIClient, post: Post, user: User
):
    reaction = Reaction.objects.create(user=user, content=post, type="like")

    user_client.delete(
        f"/be/threads/posts/{post.id}/reactions/like/",
    )

    assert not Reaction.objects.filter(id=reaction.id).exists()


@pytest.mark.django_db
def test_delete_post_reaction_returns_204_when_post_does_not_exist(
    user_client: APIClient, post: Post
):
    post_id = post.id
    post.delete()

    response = user_client.delete(
        f"/be/threads/posts/{post_id}/reactions/like/",
    )

    assert response.status_code == 204


@pytest.mark.django_db
def test_delete_post_reaction_returns_401_when_not_authenticated(
    client: Client, post: Post
):
    response = client.delete(
        f"/be/threads/posts/{post.id}/reactions/like/",
    )

    assert response.status_code == 401
