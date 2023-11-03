import pytest

from .forms import UserChangeForm


@pytest.fixture
def user_props():
    return {
        "username": "ten",
        "date_joined": "2023-10-16",
        "email": "x@example.com",
        "theme": "dark",
    }


@pytest.mark.django_db
def test_valid_data_is_accepted(user_props):
    form = UserChangeForm(data=user_props)
    assert form.is_valid()


@pytest.mark.django_db
def test_username_is_required(user_props):
    del user_props["username"]
    form = UserChangeForm(data=user_props)
    assert "username" in form.errors


@pytest.mark.django_db
def test_email_is_required(user_props):
    del user_props["email"]
    form = UserChangeForm(data=user_props)
    assert "email" in form.errors


@pytest.mark.django_db
def test_date_joined_is_required(user_props):
    del user_props["date_joined"]
    form = UserChangeForm(data=user_props)
    assert "date_joined" in form.errors


@pytest.mark.django_db
def test_theme_is_required(user_props):
    del user_props["theme"]
    form = UserChangeForm(data=user_props)
    assert "theme" in form.errors


@pytest.mark.django_db
def test_theme_must_be_valid(user_props):
    user_props["theme"] = "something weird"
    form = UserChangeForm(data=user_props)
    assert "theme" in form.errors
