import pytest
from django.test import Client
from rest_framework.test import APIClient

from users.models import User
from .models import Post, Reaction


@pytest.fixture
def create_post_reaction_props(post: Post):
    return {
        "type": "like",
    }


@pytest.mark.django_db
def test_create_post_reaction_returns_201(
    user_client: Client, post: Post, create_post_reaction_props
):
    response = user_client.post(
        f"/be/threads/posts/{post.id}/reactions/",
        create_post_reaction_props,
    )

    assert response.status_code == 201


@pytest.mark.django_db
def test_create_post_reaction_saves_db_record(
    user_client: APIClient, create_post_reaction_props: dict, post: Post
):
    initial_count = Reaction.objects.count()
    user_client.post(
        f"/be/threads/posts/{post.id}/reactions/", create_post_reaction_props
    )
    assert Reaction.objects.count() == initial_count + 1


@pytest.mark.django_db
def test_create_post_reaction_gets_user_from_request(
    user_client: APIClient,
    create_post_reaction_props: dict,
    post: Post,
    user: User,
):
    user_client.post(
        f"/be/threads/posts/{post.id}/reactions/", create_post_reaction_props
    )

    reaction = Reaction.objects.last()
    assert reaction is not None
    assert reaction.user.id == user.id


@pytest.mark.django_db
def test_create_post_reaction_gets_post_from_url(
    user_client: APIClient, create_post_reaction_props: dict, post: Post
):
    user_client.post(
        f"/be/threads/posts/{post.id}/reactions/", create_post_reaction_props
    )

    reaction = Reaction.objects.last()
    assert reaction is not None
    assert reaction.content == post


@pytest.mark.django_db
def test_create_post_reaction_deletes_previous_reaction(
    user_client: APIClient, create_post_reaction_props: dict, post: Post
):
    # Create the first reaction
    create_post_reaction_props["type"] = "like"
    user_client.post(
        f"/be/threads/posts/{post.id}/reactions/", create_post_reaction_props
    )

    old_reaction = Reaction.objects.last()

    # Replace it
    new_type = "laugh"
    create_post_reaction_props["type"] = new_type
    user_client.post(
        f"/be/threads/posts/{post.id}/reactions/", create_post_reaction_props
    )

    # Check that the old reaction was deleted
    assert old_reaction is not None
    assert not Reaction.objects.filter(id=old_reaction.id).exists()

    # Check that the new reaction was created
    new_reaction = Reaction.objects.last()
    assert new_reaction is not None
    assert new_reaction.type == new_type


@pytest.mark.django_db
def test_create_post_reaction_returns_401_when_not_authenticated(
    client: Client, post: Post, create_post_reaction_props
):
    response = client.post(
        f"/be/threads/posts/{post.id}/reactions/",
        create_post_reaction_props,
    )

    assert response.status_code == 401


@pytest.mark.django_db
def test_create_post_reaction_returns_400_when_invalid(
    user_client: APIClient, post: Post, create_post_reaction_props
):
    del create_post_reaction_props["type"]

    response = user_client.post(
        f"/be/threads/posts/{post.id}/reactions/",
        create_post_reaction_props,
    )

    assert response.status_code == 400
