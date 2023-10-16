import pytest

import users.factories as users_factories


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
