import pytest
from django.test import Client
from faker import Faker
from rest_framework.test import APIClient

from users.models import User
from .models import Post, Reply

fake = Faker()


@pytest.fixture
def create_post_props(user: User):
    return {
        "title": fake.sentence(),
        "body": fake.paragraph(),
    }


@pytest.fixture
def create_reply_props(post: Post):
    return {
        "post": post.id,
        "body": fake.paragraph(),
    }


@pytest.mark.django_db
def test_get_posts_returns_200(client: Client):
    response = client.get("/api/threads/posts/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_post_detail_returns_200(client: Client, post: Post):
    response = client.get(f"/api/threads/posts/{post.id}/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_post_detail_returns_404_when_missing(client: Client, post: Post):
    post.delete()
    response = client.get(f"/api/threads/posts/{post.id}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_create_post_returns_201(
    user_client: APIClient, create_post_props: dict, user: User
):
    response = user_client.post("/api/threads/posts/", create_post_props)
    assert response.status_code == 201


@pytest.mark.django_db
def test_create_post_returns_401_when_not_authenticated(
    client: APIClient, create_post_props: dict, user: User
):
    response = client.post("/api/threads/posts/", create_post_props)
    assert response.status_code == 401


@pytest.mark.django_db
def test_create_post_saves_db_record(
    user_client: APIClient, create_post_props: dict
):
    initial_count = Post.objects.count()
    user_client.post("/api/threads/posts/", create_post_props)
    assert Post.objects.count() == initial_count + 1


@pytest.mark.django_db
def test_create_post_returns_400_when_invalid(
    user_client: APIClient, create_post_props: dict
):
    del create_post_props["title"]
    response = user_client.post("/api/threads/posts/", create_post_props)
    assert response.status_code == 400


@pytest.mark.django_db
def test_create_reply_returns_200_when_valid(
    user_client: APIClient, create_reply_props: dict
):
    response = user_client.post("/api/threads/replies/", create_reply_props)
    assert response.status_code == 200


@pytest.mark.django_db
def test_create_reply_returns_400_when_invalid(
    user_client: APIClient, create_reply_props: dict
):
    del create_reply_props["post"]
    response = user_client.post("/api/threads/replies/", create_reply_props)
    assert response.status_code == 400


@pytest.mark.django_db
def test_create_reply_assigns_request_user_as_author(
    user_client: APIClient, user: User, create_reply_props: dict
):
    user_client.post("/api/threads/replies/", create_reply_props)

    reply = Reply.objects.last()
    assert reply is not None
    assert reply.author_id == user.id
