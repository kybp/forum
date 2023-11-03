import json
import pytest
from faker import Faker
from rest_framework.test import APIClient

from users.factories import UserFactory
from users.models import User
from .models import Reply

fake = Faker()


@pytest.fixture
def update_reply_props(reply: Reply):
    return {
        "id": reply.id,
        "post": reply.post.id,
        "body": fake.paragraph(),
    }


def make_request(client: APIClient, props: dict):
    return client.put(
        f"/api/threads/posts/{props['post']}/replies/{props['id']}/",
        data=json.dumps(props),
        content_type="application/json",
    )


@pytest.mark.django_db
def test_returns_200(user_client: APIClient, update_reply_props: dict):
    response = make_request(user_client, update_reply_props)
    assert response.status_code == 200


@pytest.mark.django_db
def test_returns_404_when_reply_does_not_exist(
    user_client: APIClient, update_reply_props: dict, reply: Reply
):
    Reply.objects.filter(pk=reply.pk).delete()
    response = make_request(user_client, update_reply_props)
    assert response.status_code == 404


@pytest.mark.django_db
def test_returns_401_when_not_authenticated(
    client: APIClient, update_reply_props: dict
):
    response = make_request(client, update_reply_props)
    assert response.status_code == 401


@pytest.mark.django_db
def test_returns_400_when_invalid(
    user_client: APIClient, update_reply_props: dict
):
    update_reply_props["body"] = ""
    response = make_request(user_client, update_reply_props)
    assert response.status_code == 400


@pytest.mark.django_db
def test_returns_403_for_other_user(
    user_client: APIClient,
    update_reply_props: dict,
    reply: Reply,
):
    reply.author = UserFactory()
    reply.save()
    response = make_request(user_client, update_reply_props)
    assert response.status_code == 403


@pytest.mark.django_db
def test_updates_db_record(
    user_client: APIClient, user: User, update_reply_props: dict, reply: Reply
):
    assert update_reply_props["body"] != reply.body

    make_request(user_client, update_reply_props)

    reply.refresh_from_db()
    assert reply.body == update_reply_props["body"]


@pytest.mark.django_db
def test_does_not_update_fields_that_are_left_out(
    user_client: APIClient, user: User, update_reply_props: dict, reply: Reply
):
    original_body = reply.body
    del update_reply_props["body"]

    make_request(user_client, update_reply_props)

    reply.refresh_from_db()
    assert reply.body == original_body
