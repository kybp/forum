import pytest
from rest_framework.test import APIClient

from users.factories import UserFactory
from .factories import PostFactory, TagFactory
from .models import Post
from .serializers import PostSerializer


@pytest.mark.django_db
def test_returns_200(client: APIClient):
    response = client.get("/be/threads/posts/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_returns_posts(client: APIClient, post: Post):
    response = client.get("/be/threads/posts/")
    assert response.data == [PostSerializer(post).data]


@pytest.mark.django_db
def test_does_not_return_deleted_posts(client: APIClient, post: Post):
    post.delete()
    response = client.get("/be/threads/posts/")
    assert response.data == []


@pytest.mark.django_db
def test_filtered_by_tags(client: APIClient):
    tags = "tag one", "tag two"
    posts = [PostFactory() for tag in tags]
    for tag, post in zip(tags, posts):
        TagFactory(post=post, name=tag)
        TagFactory(post=PostFactory(), name=f"other #{tag}")

    query_string = f"?tag={tags[0]}&tag={tags[1]}"
    response = client.get(f"/be/threads/posts/{query_string}")

    assert response.json() == PostSerializer(posts, many=True).data


@pytest.mark.django_db
def test_filtered_by_authors(client: APIClient):
    authors = [UserFactory(), UserFactory()]
    posts = [PostFactory(author=author) for author in authors]
    PostFactory()

    query_string = f"?author={authors[0].id}&author={authors[1].id}"
    response = client.get(f"/be/threads/posts/{query_string}")

    assert response.json() == PostSerializer(posts, many=True).data
