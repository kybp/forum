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


class ReplyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Reply

    author: Any = factory.SubFactory(users_factories.UserFactory)
    post: Any = factory.SubFactory(PostFactory)
    body: Any = factory.Faker("paragraph")
    date_posted: Any = factory.Faker("past_datetime")


class ReactionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Reaction

    class Params:
        type = "like"

    content: Any = factory.SubFactory(PostFactory)
    user: Any = factory.SubFactory(users_factories.UserFactory)


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Tag

    post: Any = factory.SubFactory(PostFactory)
    name: Any = factory.Faker("word")
