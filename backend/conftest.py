import pytest
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

import threads.factories as threads_factories
import users.factories as users_factories
from users.models import User


@pytest.fixture
def user():
    user = users_factories.UserFactory()
    unhashed_password = user.password
    user.set_password(unhashed_password)
    user.save()
    # Save the unhashed password back to the object for convenience in
    # tests.
    #
    # Note that if you want to save the object again (it's already in
    # the DB by here), you won't be able to authenticate unless you do
    # `user.set_password(user.password)` before saving it.
    user.password = unhashed_password
    return user


@pytest.fixture
def post():
    return threads_factories.PostFactory()


@pytest.fixture
def reply():
    return threads_factories.ReplyFactory()


@pytest.fixture
def user_client(user: User) -> APIClient:
    token, _created = Token.objects.get_or_create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return client
