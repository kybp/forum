import datetime
import pytest
from faker import Faker
from rest_framework.request import Request

from users.models import User
from .models import Post
from .serializers import PostSerializer

fake = Faker()


@pytest.fixture
def post_props(user: User):
    return {
        "author_id": user.id,
        "title": fake.sentence(),
        "body": fake.paragraph(),
    }


@pytest.mark.django_db
def test_contains_expected_fields(post: Post):
    assert set(PostSerializer(post).data.keys()) == {
        "id",
        "author_id",
        "title",
        "body",
        "date_posted",
    }


@pytest.mark.django_db
def test_is_valid_when_valid(post_props: dict, user_request: Request):
    serializer = PostSerializer(
        data=post_props, context={"request": user_request}
    )
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
def test_body_can_be_blank(post_props: dict, user_request: Request):
    post_props["body"] = ""
    serializer = PostSerializer(
        data=post_props, context={"request": user_request}
    )
    assert serializer.is_valid()


@pytest.mark.django_db
def test_author_id_is_request_user(post_props: dict, user_request: Request):
    # Test that it can't be overridden
    post_props["author_id"] = f"{user_request.user.id}x"
    serializer = PostSerializer(
        data=post_props, context={"request": user_request}
    )
    serializer.is_valid(raise_exception=True)
    post = serializer.save()
    assert user_request.user == post.author


@pytest.mark.django_db
def test_date_posted_is_populated_on_create(
    post_props: dict, user_request: Request
):
    serializer = PostSerializer(
        data=post_props, context={"request": user_request}
    )
    serializer.is_valid(raise_exception=True)
    post = serializer.save()
    assert type(post.date_posted) is datetime.datetime
