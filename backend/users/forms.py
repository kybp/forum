from django import forms
from django.contrib.auth import get_user_model
import django.contrib.auth.forms as auth_forms


User = get_user_model()


class UserCreationForm(auth_forms.UserCreationForm):
    """A custom form for creating Users that includes a required email."""

    email = forms.EmailField(
        max_length=64,
        help_text="Enter a valid email address",
    )

    class Meta(auth_forms.UserCreationForm.Meta):
        model = User
        fields = tuple(auth_forms.UserCreationForm.Meta.fields) + ("email",)


class UserChangeForm(auth_forms.UserChangeForm):
    """A custom form for editing Users that makes email required."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["email"].required = True

    class Meta(auth_forms.UserChangeForm.Meta):
        model = User
