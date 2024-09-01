import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from faker import Faker
from rest_framework.test import APIClient

from .models import PostImage

fake = Faker()


@pytest.fixture
def url():
    return "/be/threads/post-images/"


@pytest.fixture
def post_images_props():
    with open("test_assets/image.gif", "rb") as gif_file:
        gif = SimpleUploadedFile(
            name="image.gif", content=gif_file.read(), content_type="image/gif"
        )

        with open("test_assets/image.jpg", "rb") as jpeg_file:
            jpeg = SimpleUploadedFile(
                name="image.jpg",
                content=jpeg_file.read(),
                content_type="image/jpeg",
            )

            with open("test_assets/image.png", "rb") as png_file:
                png = SimpleUploadedFile(
                    name="image.png",
                    content=png_file.read(),
                    content_type="image/png",
                )

                yield {"images": [gif, jpeg, png]}


@pytest.mark.django_db
def test_post_images_returns_201(
    user_client: APIClient,
    post_images_props: dict,
    url: str,
):
    response = user_client.post(url, post_images_props)
    assert response.status_code == 201


@pytest.mark.django_db
def test_post_images_saves_db_record(
    user_client: APIClient,
    post_images_props: dict,
    url: str,
):
    initial_count = PostImage.objects.count()
    uploaded_images_count = len(post_images_props["images"])
    user_client.post(url, post_images_props)
    assert PostImage.objects.count() == initial_count + uploaded_images_count


@pytest.mark.django_db
def test_post_images_returns_401_when_not_authenticated(
    client: APIClient,
    post_images_props: dict,
    url: str,
):
    response = client.post(url, post_images_props)
    assert response.status_code == 401
