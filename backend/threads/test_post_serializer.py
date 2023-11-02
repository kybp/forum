import datetime
import pytest
from faker import Faker

from users.models import User
from .factories import ReactionFactory, ReplyFactory, TagFactory
from .models import Post
from .serializers import PostSerializer, ReactionSerializer

fake = Faker()


@pytest.fixture
def post_props(user: User):
    return {
        "author": user.id,
        "title": fake.sentence(),
        "body": fake.paragraph(),
        "tags": [fake.word()],
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
        "reactions",
        "tags",
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
def test_includes_replies_as_ids(post: Post):
    replies = [ReplyFactory(post=post), ReplyFactory(post=post)]

    serializer = PostSerializer(post)

    assert len(serializer.data["replies"]) == len(replies)
    for reply in replies:
        assert reply.id in serializer.data["replies"]


@pytest.mark.django_db
def test_includes_reactions_as_objects(post: Post):
    reactions = [ReactionFactory(content=post), ReactionFactory(content=post)]

    serializer = PostSerializer(post)
    returned = serializer.data["reactions"]

    assert len(returned) == len(reactions)
    for reaction, returned_reaction in zip(reactions, returned):
        assert returned_reaction == ReactionSerializer(reaction).data


@pytest.mark.django_db
def test_includes_tags_as_strings(post: Post):
    tags = [TagFactory(post=post), TagFactory(post=post)]
    serializer = PostSerializer(post)
    assert serializer.data["tags"] == [tag.name for tag in tags]


@pytest.mark.django_db
def test_author_is_null_when_post_is_deleted(post: Post):
    post.is_deleted = True
    serializer = PostSerializer(post)
    assert serializer.data["author"] is None


@pytest.mark.django_db
def test_body_is_deleted_when_post_is_deleted(post: Post):
    post.is_deleted = True
    serializer = PostSerializer(post)
    assert serializer.data["body"] == "[deleted]"
