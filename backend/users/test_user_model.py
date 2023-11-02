import hashlib
import pytest

from .models import User


@pytest.mark.django_db
def test_avatar_is_gravatar_url_from_email(user: User):
    hash = hashlib.sha256(user.email.encode("utf-8")).hexdigest()
    assert user.avatar == f"https://gravatar.com/avatar/{hash}?s=50"
