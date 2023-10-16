from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .forms import UserCreationForm, UserChangeForm


User = get_user_model()


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    """Admin model for custom User model with required email."""

    form = UserChangeForm
    add_form = UserCreationForm

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "password1", "password2"),
            },
        ),
    )
