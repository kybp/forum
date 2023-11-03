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
        "date_edited",
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


@pytest.mark.django_db
def test_date_edited_is_null_when_not_edited(reply: Reply):
    assert ReplySerializer(reply).data["date_edited"] is None


@pytest.mark.django_db
def test_date_edited_is_included_when_edited(reply: Reply):
    reply.body += "foo"
    reply.save()
    assert ReplySerializer(reply).data["date_edited"] is not None
