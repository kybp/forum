import pytest
from django.test import Client
from faker import Faker
from rest_framework.test import APIClient

from users.models import User
from .models import Post, Reply

fake = Faker()


@pytest.fixture
def create_reply_props(post: Post):
    return {
        "body": fake.paragraph(),
    }


@pytest.mark.django_db
def test_returns_201_when_valid(
    user_client: APIClient, create_reply_props: dict, post: Post
):
    response = user_client.post(
        f"/be/threads/posts/{post.id}/replies/", create_reply_props
    )
    assert response.status_code == 201


@pytest.mark.django_db
def test_saves_db_record(
    user_client: APIClient, create_reply_props: dict, post: Post
):
    initial_count = Reply.objects.count()
    user_client.post(
        f"/be/threads/posts/{post.id}/replies/", create_reply_props
    )
    assert Reply.objects.count() == initial_count + 1


@pytest.mark.django_db
def test_returns_401_when_not_authenticated(
    client: Client, create_reply_props: dict, post: Post
):
    response = client.post(
        f"/be/threads/posts/{post.id}/replies/", create_reply_props
    )
    assert response.status_code == 401


@pytest.mark.django_db
def test_returns_400_when_invalid(
    user_client: APIClient, create_reply_props: dict, post: Post
):
    del create_reply_props["body"]
    response = user_client.post(
        f"/be/threads/posts/{post.id}/replies/", create_reply_props
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_can_reply_when_post_is_deleted(
    user_client: APIClient, create_reply_props: dict, post: Post
):
    post_id = post.id
    post.delete()
    response = user_client.post(
        f"/be/threads/posts/{post_id}/replies/", create_reply_props
    )
    assert response.status_code == 201


@pytest.mark.django_db
def test_returns_404_when_post_does_not_exist(
    user_client: APIClient, create_reply_props: dict, post: Post
):
    post_id = post.id
    Post.objects.filter(pk=post_id).delete()
    response = user_client.post(
        f"/be/threads/posts/{post_id}/replies/", create_reply_props
    )
    assert response.status_code == 404


@pytest.mark.django_db
def test_create_reply_assigns_request_user_as_author(
    user_client: APIClient, user: User, create_reply_props: dict, post: Post
):
    user_client.post(
        f"/be/threads/posts/{post.id}/replies/", create_reply_props
    )

    reply = Reply.objects.last()
    assert reply is not None
    assert reply.author_id == user.id
