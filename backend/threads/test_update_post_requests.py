import json
import pytest
from faker import Faker
from rest_framework.test import APIClient

from users.factories import UserFactory
from users.models import User
from .models import Post

fake = Faker()


@pytest.fixture
def update_post_props(post: Post):
    return {
        "id": post.id,
        "title": fake.sentence(),
        "body": fake.paragraph(),
        "tags": [fake.word()],
    }


def make_request(client: APIClient, props: dict):
    return client.put(f"/api/threads/posts/{props['id']}/", props)


@pytest.mark.django_db
def test_returns_200(user_client: APIClient, update_post_props: dict):
    response = make_request(user_client, update_post_props)
    assert response.status_code == 200


@pytest.mark.django_db
def test_saves_unique_trimmed_non_blank_tags(
    user_client: APIClient, update_post_props: dict, post: Post
):
    update_post_props["tags"] = "one", "", "  ", " two ", "   two"

    assert set(tag.name for tag in post.tags.all()) != {"one", "two"}

    user_client.put(
        f"/api/threads/posts/{post.id}/",
        data=json.dumps(update_post_props),
        content_type="application/json",
    )

    post.refresh_from_db()
    assert set(tag.name for tag in post.tags.all()) == {"one", "two"}


@pytest.mark.django_db
def test_returns_404_when_post_does_not_exist(
    user_client: APIClient, update_post_props: dict, post: Post
):
    Post.objects.filter(pk=post.pk).delete()
    response = make_request(user_client, update_post_props)
    assert response.status_code == 404


@pytest.mark.django_db
def test_returns_401_when_not_authenticated(
    client: APIClient, update_post_props: dict, user: User
):
    response = make_request(client, update_post_props)
    assert response.status_code == 401


@pytest.mark.django_db
def test_returns_400_when_invalid(
    user_client: APIClient, update_post_props: dict
):
    update_post_props["title"] = ""
    response = make_request(user_client, update_post_props)
    assert response.status_code == 400


@pytest.mark.django_db
def test_returns_403_for_other_user(
    user_client: APIClient,
    update_post_props: dict,
    post: Post,
):
    post.author = UserFactory()
    post.save()
    response = make_request(user_client, update_post_props)
    assert response.status_code == 403


@pytest.mark.django_db
def test_updates_db_record(
    user_client: APIClient, user: User, update_post_props: dict, post: Post
):
    assert update_post_props["title"] != post.title

    make_request(user_client, update_post_props)

    post.refresh_from_db()
    assert post.title == update_post_props["title"]
