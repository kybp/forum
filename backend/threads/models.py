from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import (
    GenericForeignKey,
    GenericRelation,
)
from django.contrib.contenttypes.models import ContentType
from django.db import models

User = get_user_model()


class Reaction(models.Model):
    """A user's response to some content."""

    class ReactionType(models.TextChoices):
        LIKE = "like", "like"
        LAUGH = "laugh", "laugh"
        CONFUSED = "confused", "confused"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        help_text="The user who made the reaction.",
    )
    type = models.CharField(
        null=False, blank=False, choices=ReactionType.choices
    )
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        help_text="The type of content that was being reacted to.",
    )
    object_id = models.PositiveIntegerField()
    content = GenericForeignKey("content_type", "object_id")
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

        constraints = [
            models.UniqueConstraint(
                fields=["user_id", "object_id"], name="unique_reaction"
            )
        ]


class Post(models.Model):
    """A forum post."""

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(null=False, blank=False)
    body = models.TextField(null=False, blank=True)
    date_posted = models.DateTimeField(auto_now_add=True)

    def _truncate(self, string: str, n: int) -> str:
        return (string[:n] + "...") if len(string) > n else string

    def __str__(self):
        title = self._truncate(self.title, 50)
        body = self._truncate(self.body, 200)
        separator = " --- " if body else ""

        return f"{title}{separator}{body}"

    reactions = GenericRelation(Reaction)


class Tag(models.Model):
    """A user-facing, semantic category a post can be placed in."""

    name = models.CharField(null=False, blank=False)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="tags"
    )


class Reply(models.Model):
    """A reply to a Post."""

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="replies"
    )
    body = models.TextField(null=False, blank=False)
    date_posted = models.DateTimeField(auto_now_add=True)
