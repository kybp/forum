import pytest
from faker import Faker

from .models import User
from .serializers import UserSerializer

fake = Faker()


@pytest.mark.django_db
def test_contains_expected_fields(user: User):
    serializer = UserSerializer(user)
    assert set(serializer.data.keys()) == {"id", "username", "avatar"}


@pytest.mark.django_db
def test_nondeleted_users_have_usernames(user: User):
    serializer = UserSerializer(user)
    assert serializer.data["username"] == user.username


@pytest.mark.django_db
def test_deleted_users_have_deleted_usernames(user: User):
    user.is_active = False
    serializer = UserSerializer(user)
    assert serializer.data["username"] == "[deleted]"


@pytest.mark.django_db
def test_deleted_users_do_not_have_avatars(user: User):
    user.is_active = False
    serializer = UserSerializer(user)
    assert serializer.data["avatar"] == ""
