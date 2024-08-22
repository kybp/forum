import json
import pytest
from faker import Faker
from rest_framework.test import APIClient

from users.models import User
from .models import Post

fake = Faker()


@pytest.fixture
def create_post_props(user: User):
    return {
        "title": fake.sentence(),
        "body": fake.paragraph(),
        "tags": [fake.word()],
    }


@pytest.mark.django_db
def test_create_post_returns_201(
    user_client: APIClient, create_post_props: dict, user: User
):
    response = user_client.post("/be/threads/posts/", create_post_props)
    assert response.status_code == 201


@pytest.mark.django_db
def test_create_post_saves_db_record(
    user_client: APIClient, create_post_props: dict
):
    initial_count = Post.objects.count()
    user_client.post("/be/threads/posts/", create_post_props)
    assert Post.objects.count() == initial_count + 1


@pytest.mark.django_db
def test_create_post_saves_unique_trimmed_non_blank_tags(
    user_client: APIClient, create_post_props: dict
):
    create_post_props["tags"] = "one", "", "  ", " two ", "   two"

    user_client.post(
        "/be/threads/posts/",
        data=json.dumps(create_post_props),
        content_type="application/json",
    )

    post = Post.objects.last()
    assert post is not None
    assert set(tag.name for tag in post.tags.all()) == {"one", "two"}


@pytest.mark.django_db
def test_create_post_returns_401_when_not_authenticated(
    client: APIClient, create_post_props: dict, user: User
):
    response = client.post("/be/threads/posts/", create_post_props)
    assert response.status_code == 401


@pytest.mark.django_db
def test_create_post_returns_400_when_invalid(
    user_client: APIClient, create_post_props: dict
):
    del create_post_props["title"]
    response = user_client.post("/be/threads/posts/", create_post_props)
    assert response.status_code == 400


@pytest.mark.django_db
def test_create_post_assigns_request_user_as_author(
    user_client: APIClient, user: User, create_post_props: dict
):
    user_client.post("/be/threads/posts/", create_post_props)

    post = Post.objects.last()
    assert post is not None
    assert post.author_id == user.id
