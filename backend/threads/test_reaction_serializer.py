import pytest
from faker import Faker

from users.models import User
from .models import Post, Reaction
from .serializers import ReactionSerializer

fake = Faker()


@pytest.fixture
def reaction_props(user: User, post: Post):
    return {
        "user": user.id,
        "content": post.id,
        "type": "like",
    }


@pytest.mark.django_db
def test_contains_expected_fields(reaction: Reaction):
    assert set(ReactionSerializer(reaction).data.keys()) == {
        "user",
        "content",
        "type",
    }


@pytest.mark.django_db
def test_is_valid_when_valid(reaction_props: dict):
    serializer = ReactionSerializer(data=reaction_props)
    assert serializer.is_valid()


@pytest.mark.django_db
def test_type_is_required(reaction_props: dict):
    del reaction_props["type"]
    serializer = ReactionSerializer(data=reaction_props)
    assert not serializer.is_valid()
    assert "type" in serializer.errors


@pytest.mark.django_db
def test_type_cannot_be_blank(reaction_props: dict):
    reaction_props["type"] = ""
    serializer = ReactionSerializer(data=reaction_props)
    assert not serializer.is_valid()
    assert "type" in serializer.errors
