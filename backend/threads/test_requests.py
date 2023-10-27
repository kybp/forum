import pytest
from django.test import Client
from faker import Faker
from rest_framework.test import APIClient

from users.models import User
from .models import Post, Reaction, Reply

fake = Faker()


@pytest.fixture
def create_post_props(user: User):
    return {
        "title": fake.sentence(),
        "body": fake.paragraph(),
    }


@pytest.fixture
def create_reply_props(post: Post):
    return {
        "body": fake.paragraph(),
    }


@pytest.fixture
def create_post_reaction_props(post: Post):
    return {
        "type": "like",
    }


@pytest.mark.django_db
def test_get_posts_returns_200(client: Client):
    response = client.get("/api/threads/posts/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_post_detail_returns_200(client: Client, post: Post):
    response = client.get(f"/api/threads/posts/{post.id}/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_post_detail_returns_404_when_missing(client: Client, post: Post):
    post_id = post.id
    post.delete()
    response = client.get(f"/api/threads/posts/{post_id}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_create_post_returns_201(
    user_client: APIClient, create_post_props: dict, user: User
):
    response = user_client.post("/api/threads/posts/", create_post_props)
    assert response.status_code == 201


@pytest.mark.django_db
def test_create_post_returns_401_when_not_authenticated(
    client: APIClient, create_post_props: dict, user: User
):
    response = client.post("/api/threads/posts/", create_post_props)
    assert response.status_code == 401


@pytest.mark.django_db
def test_create_post_saves_db_record(
    user_client: APIClient, create_post_props: dict
):
    initial_count = Post.objects.count()
    user_client.post("/api/threads/posts/", create_post_props)
    assert Post.objects.count() == initial_count + 1


@pytest.mark.django_db
def test_create_post_returns_400_when_invalid(
    user_client: APIClient, create_post_props: dict
):
    del create_post_props["title"]
    response = user_client.post("/api/threads/posts/", create_post_props)
    assert response.status_code == 400


@pytest.mark.django_db
def test_create_post_assigns_request_user_as_author(
    user_client: APIClient, user: User, create_post_props: dict
):
    user_client.post("/api/threads/posts/", create_post_props)

    post = Post.objects.last()
    assert post is not None
    assert post.author_id == user.id


@pytest.mark.django_db
def test_create_reply_returns_201_when_valid(
    user_client: APIClient, create_reply_props: dict, post: Post
):
    response = user_client.post(
        f"/api/threads/posts/{post.id}/replies/", create_reply_props
    )
    assert response.status_code == 201


@pytest.mark.django_db
def test_create_reply_saves_db_record(
    user_client: APIClient, create_reply_props: dict, post: Post
):
    initial_count = Reply.objects.count()
    user_client.post(
        f"/api/threads/posts/{post.id}/replies/", create_reply_props
    )
    assert Reply.objects.count() == initial_count + 1


@pytest.mark.django_db
def test_create_reply_returns_401_when_not_authenticated(
    client: Client, create_reply_props: dict, post: Post
):
    response = client.post(
        f"/api/threads/posts/{post.id}/replies/", create_reply_props
    )
    assert response.status_code == 401


@pytest.mark.django_db
def test_create_reply_returns_400_when_invalid(
    user_client: APIClient, create_reply_props: dict, post: Post
):
    del create_reply_props["body"]
    response = user_client.post(
        f"/api/threads/posts/{post.id}/replies/", create_reply_props
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_create_reply_returns_404_when_post_does_not_exist(
    user_client: APIClient, create_reply_props: dict, post: Post
):
    post_id = post.id
    post.delete()
    response = user_client.post(
        f"/api/threads/posts/{post_id}/replies/", create_reply_props
    )
    assert response.status_code == 404


@pytest.mark.django_db
def test_create_reply_assigns_request_user_as_author(
    user_client: APIClient, user: User, create_reply_props: dict, post: Post
):
    user_client.post(
        f"/api/threads/posts/{post.id}/replies/", create_reply_props
    )

    reply = Reply.objects.last()
    assert reply is not None
    assert reply.author_id == user.id


@pytest.mark.django_db
def test_get_post_replies_returns_200(client: Client, post: Post):
    response = client.get(f"/api/threads/posts/{post.id}/replies/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_create_post_reaction_returns_201(
    user_client: Client, post: Post, create_post_reaction_props
):
    response = user_client.post(
        f"/api/threads/posts/{post.id}/reactions/",
        create_post_reaction_props,
    )

    assert response.status_code == 201


@pytest.mark.django_db
def test_create_post_reaction_saves_db_record(
    user_client: APIClient, create_post_reaction_props: dict, post: Post
):
    initial_count = Reaction.objects.count()
    user_client.post(
        f"/api/threads/posts/{post.id}/reactions/", create_post_reaction_props
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
        f"/api/threads/posts/{post.id}/reactions/", create_post_reaction_props
    )

    reaction = Reaction.objects.last()
    assert reaction is not None
    assert reaction.user.id == user.id


@pytest.mark.django_db
def test_create_post_reaction_gets_post_from_url(
    user_client: APIClient, create_post_reaction_props: dict, post: Post
):
    user_client.post(
        f"/api/threads/posts/{post.id}/reactions/", create_post_reaction_props
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
        f"/api/threads/posts/{post.id}/reactions/", create_post_reaction_props
    )

    old_reaction = Reaction.objects.last()

    # Replace it
    new_type = "laugh"
    create_post_reaction_props["type"] = new_type
    user_client.post(
        f"/api/threads/posts/{post.id}/reactions/", create_post_reaction_props
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
        f"/api/threads/posts/{post.id}/reactions/",
        create_post_reaction_props,
    )

    assert response.status_code == 401


@pytest.mark.django_db
def test_create_post_reaction_returns_400_when_invalid(
    user_client: APIClient, post: Post, create_post_reaction_props
):
    del create_post_reaction_props["type"]

    response = user_client.post(
        f"/api/threads/posts/{post.id}/reactions/",
        create_post_reaction_props,
    )

    assert response.status_code == 400


@pytest.mark.django_db
def test_delete_post_reaction_returns_204(user_client: APIClient, post: Post):
    response = user_client.delete(
        f"/api/threads/posts/{post.id}/reactions/like/",
    )

    assert response.status_code == 204


@pytest.mark.django_db
def test_delete_post_reaction_deletes_the_object(
    user_client: APIClient, post: Post, user: User
):
    reaction = Reaction.objects.create(user=user, content=post, type="like")

    user_client.delete(
        f"/api/threads/posts/{post.id}/reactions/like/",
    )

    assert not Reaction.objects.filter(id=reaction.id).exists()


@pytest.mark.django_db
def test_delete_post_reaction_returns_204_when_post_does_not_exist(
    user_client: APIClient, post: Post
):
    post_id = post.id
    post.delete()

    response = user_client.delete(
        f"/api/threads/posts/{post_id}/reactions/like/",
    )

    assert response.status_code == 204


@pytest.mark.django_db
def test_delete_post_reaction_returns_401_when_not_authenticated(
    client: Client, post: Post
):
    response = client.delete(
        f"/api/threads/posts/{post.id}/reactions/like/",
    )

    assert response.status_code == 401
