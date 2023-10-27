import pytest
from faker import Faker

from users.models import User
from .models import Post, Reply
from .serializers import ReplySerializer

fake = Faker()


@pytest.fixture
def reply_props(user: User, post: Post):
    return {
        "author": user.id,
        "post": post.id,
        "title": fake.sentence(),
        "body": fake.paragraph(),
    }


@pytest.mark.django_db
def test_contains_expected_fields(reply: Reply):
    assert set(ReplySerializer(reply).data.keys()) == {
        "id",
        "author",
        "post",
        "body",
        "date_posted",
    }


@pytest.mark.django_db
def test_is_valid_when_valid(reply_props: dict):
    serializer = ReplySerializer(data=reply_props)
    assert serializer.is_valid()


@pytest.mark.django_db
def test_body_is_required(reply_props: dict):
    del reply_props["body"]
    serializer = ReplySerializer(data=reply_props)
    assert not serializer.is_valid()
    assert "body" in serializer.errors


@pytest.mark.django_db
def test_body_cannot_be_blank(reply_props: dict):
    reply_props["body"] = ""
    serializer = ReplySerializer(data=reply_props)
    assert not serializer.is_valid()
    assert "body" in serializer.errors
