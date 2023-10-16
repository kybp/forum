import factory
from typing import Any

from . import models


class UserFactory(factory.Factory):
    class Meta:
        model = models.User

    username: Any = factory.Faker("email")
    email: Any = factory.Faker("email")
    password: Any = factory.Faker("password")
