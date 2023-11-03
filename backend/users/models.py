import hashlib
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """User model."""

    class Theme(models.TextChoices):
        LIGHT = "light", "light"
        DARK = "dark", "dark"

    REQUIRED_FIELDS = ["email"]

    email = models.EmailField(
        _("email address"),
        unique=True,
        blank=False,
        null=False,
    )

    theme = models.CharField(
        null=False, blank=False, choices=Theme.choices, default=Theme.LIGHT
    )

    @property
    def avatar(self):
        hash = hashlib.sha256(self.email.encode("utf-8")).hexdigest()
        return f"https://gravatar.com/avatar/{hash}?s=50"
