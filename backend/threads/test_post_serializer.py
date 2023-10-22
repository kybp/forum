import datetime
import pytest
from faker import Faker

from users.models import User
from .factories import ReplyFactory
from .models import Post
from .serializers import PostSerializer

fake = Faker()


@pytest.fixture
def post_props(user: User):
    return {
        "author": user.id,
        "title": fake.sentence(),
        "body": fake.paragraph(),
    }


@pytest.mark.django_db
def test_contains_expected_fields(post: Post):
    assert set(PostSerializer(post).data.keys()) == {
        "id",
        "author",
        "title",
        "body",
        "date_posted",
        "replies",
    }


@pytest.mark.django_db
def test_is_valid_when_valid(post_props: dict):
    serializer = PostSerializer(data=post_props)
    assert serializer.is_valid()


@pytest.mark.django_db
def test_title_is_required(post_props: dict):
    del post_props["title"]
    serializer = PostSerializer(data=post_props)
    assert not serializer.is_valid()
    assert "title" in serializer.errors


@pytest.mark.django_db
def test_title_cannot_be_blank(post_props: dict):
    post_props["title"] = ""
    serializer = PostSerializer(data=post_props)
    assert not serializer.is_valid()
    assert "title" in serializer.errors


@pytest.mark.django_db
def test_body_can_be_blank(post_props: dict):
    post_props["body"] = ""
    serializer = PostSerializer(data=post_props)
    assert serializer.is_valid()


@pytest.mark.django_db
def test_date_posted_is_populated_on_create(post_props: dict, user: User):
    serializer = PostSerializer(data=post_props)
    serializer.is_valid(raise_exception=True)
    post = serializer.save(author=user)
    assert type(post.date_posted) is datetime.datetime


@pytest.mark.django_db
def test_includes_replies(post: Post):
    replies = [ReplyFactory(post=post), ReplyFactory(post=post)]

    serializer = PostSerializer(post)

    assert len(serializer.data["replies"]) == len(replies)
    for reply in replies:
        assert reply.id in serializer.data["replies"]
