import factory
from typing import Any

import users.factories as users_factories
from . import models


class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Post

    author: Any = factory.SubFactory(users_factories.UserFactory)
    title: Any = factory.Faker("sentence")
    body: Any = factory.Faker("paragraph")
    date_posted: Any = factory.Faker("past_datetime")
