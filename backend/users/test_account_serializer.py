import pytest
from faker import Faker

from .models import User
from .serializers import AccountSerializer

fake = Faker()


@pytest.fixture
def props(user: User):
    return {
        "username": fake.email(),
        "email": fake.email(),
        "password": fake.password(),
    }


@pytest.mark.django_db
def test_contains_expected_fields(user: User):
    serializer = AccountSerializer(user)
    assert set(serializer.data.keys()) == {
        "id",
        "username",
        "email",
        "avatar",
    }


@pytest.mark.django_db
def test_is_valid_when_valid(props: dict):
    serializer = AccountSerializer(data=props)
    assert serializer.is_valid()


@pytest.mark.django_db
def test_username_is_required(props: dict):
    del props["username"]
    serializer = AccountSerializer(data=props)
    assert not serializer.is_valid()
    assert "username" in serializer.errors


@pytest.mark.django_db
def test_username_cannot_be_deleted(props: dict):
    props["username"] = "[deleted]"
    serializer = AccountSerializer(data=props)
    assert not serializer.is_valid()
    assert "username" in serializer.errors


@pytest.mark.django_db
def test_email_is_required(props: dict):
    del props["email"]
    serializer = AccountSerializer(data=props)
    assert not serializer.is_valid()
    assert "email" in serializer.errors


@pytest.mark.django_db
def test_email_must_be_email(props: dict):
    props["email"] = "foo"
    serializer = AccountSerializer(data=props)
    assert not serializer.is_valid()
    assert "email" in serializer.errors


@pytest.mark.django_db
def test_password_is_required(props: dict):
    del props["password"]
    serializer = AccountSerializer(data=props)
    assert not serializer.is_valid()
    assert "password" in serializer.errors
