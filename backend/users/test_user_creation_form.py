import pytest

from .forms import UserCreationForm


@pytest.fixture
def user_props():
    password = "Password!!!11"

    return {
        "username": "x",
        "email": "x@example.com",
        "password1": password,
        "password2": password,
    }


@pytest.mark.django_db
def test_valid_data_is_accepted(user_props):
    form = UserCreationForm(data=user_props)
    assert form.is_valid()


@pytest.mark.django_db
def test_username_is_required(user_props):
    del user_props["username"]
    form = UserCreationForm(data=user_props)
    assert "username" in form.errors


@pytest.mark.django_db
def test_email_is_required(user_props):
    del user_props["email"]
    form = UserCreationForm(data=user_props)
    assert "email" in form.errors


@pytest.mark.django_db
def test_password_is_required(user_props):
    del user_props["password1"]
    del user_props["password2"]
    form = UserCreationForm(data=user_props)
    assert "password1" in form.errors
    assert "password2" in form.errors


@pytest.mark.django_db
def test_passwords_must_match(user_props):
    user_props["password2"] += "ten"
    form = UserCreationForm(data=user_props)
    assert "password1" in form.errors or "password2" in form.errors
