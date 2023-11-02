import pytest
from faker import Faker

from .models import User
from .serializers import UserSerializer

fake = Faker()


@pytest.fixture
def user_props(user: User):
    return {
        "username": fake.email(),
        "email": fake.email(),
        "password": fake.password(),
    }


@pytest.mark.django_db
def test_contains_expected_fields(user: User):
    serializer = UserSerializer(user)
    assert set(serializer.data.keys()) == {"id", "username", "avatar"}


@pytest.mark.django_db
def test_is_valid_when_valid(user_props: dict):
    serializer = UserSerializer(data=user_props)
    assert serializer.is_valid()


@pytest.mark.django_db
def test_username_is_required(user_props: dict):
    del user_props["username"]
    serializer = UserSerializer(data=user_props)
    assert not serializer.is_valid()
    assert "username" in serializer.errors


@pytest.mark.django_db
def test_username_cannot_be_deleted(user_props: dict):
    user_props["username"] = "[deleted]"
    serializer = UserSerializer(data=user_props)
    assert not serializer.is_valid()
    assert "username" in serializer.errors


@pytest.mark.django_db
def test_email_is_required(user_props: dict):
    del user_props["email"]
    serializer = UserSerializer(data=user_props)
    assert not serializer.is_valid()
    assert "email" in serializer.errors


@pytest.mark.django_db
def test_email_must_be_email(user_props: dict):
    user_props["email"] = "foo"
    serializer = UserSerializer(data=user_props)
    assert not serializer.is_valid()
    assert "email" in serializer.errors


@pytest.mark.django_db
def test_password_is_required(user_props: dict):
    del user_props["password"]
    serializer = UserSerializer(data=user_props)
    assert not serializer.is_valid()
    assert "password" in serializer.errors


@pytest.mark.django_db
def test_nondeleted_users_have_usernames(user: User):
    serializer = UserSerializer(user)
    assert serializer.data["username"] == user.username


@pytest.mark.django_db
def test_deleted_users_have_deleted_usernames(user: User):
    user.is_active = False
    serializer = UserSerializer(user)
    assert serializer.data["username"] == "[deleted]"
