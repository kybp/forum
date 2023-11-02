import hashlib
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """User model."""

    email = models.EmailField(
        _("email address"),
        unique=True,
        blank=False,
        null=False,
    )

    REQUIRED_FIELDS = ["email"]

    @property
    def avatar(self):
        hash = hashlib.sha256(self.email.encode("utf-8")).hexdigest()
        return f"https://gravatar.com/avatar/{hash}?s=50"
