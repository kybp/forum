import pytest
from django.test import Client

from users.factories import UserFactory
from .factories import PostFactory, TagFactory
from .serializers import PostSerializer


@pytest.mark.django_db
def test_get_posts_returns_200(client: Client):
    response = client.get("/api/threads/posts/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_get_posts_filtered_by_tags(client: Client):
    tags = "tag one", "tag two"
    posts = [PostFactory() for tag in tags]
    for tag, post in zip(tags, posts):
        TagFactory(post=post, name=tag)
        TagFactory(post=PostFactory(), name=f"other #{tag}")

    query_string = f"?tag={tags[0]}&tag={tags[1]}"
    response = client.get(f"/api/threads/posts/{query_string}")

    assert response.json() == PostSerializer(posts, many=True).data


@pytest.mark.django_db
def test_get_posts_filtered_by_authors(client: Client):
    authors = [UserFactory(), UserFactory()]
    posts = [PostFactory(author=author) for author in authors]
    PostFactory()

    query_string = f"?author={authors[0].id}&author={authors[1].id}"
    response = client.get(f"/api/threads/posts/{query_string}")

    assert response.json() == PostSerializer(posts, many=True).data
