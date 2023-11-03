from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import (
    GenericForeignKey,
    GenericRelation,
)
from django.contrib.contenttypes.models import ContentType
from django.db import models
from simple_history.models import HistoricalRecords

User = get_user_model()


def truncate(string: str, n: int) -> str:
    return (string[:n] + "...") if len(string) > n else string


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

    def __str__(self):
        content = truncate(str(self.content), 250)
        return f"{self.user.username} -- {self.type}: {content}"


class Post(models.Model):
    """A forum post."""

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(null=False, blank=False)
    body = models.TextField(null=False, blank=True)
    date_posted = models.DateTimeField(auto_now_add=True)
    date_edited = models.DateTimeField(auto_now=True)
    is_edited = models.BooleanField(default=False)
    reactions = GenericRelation(Reaction)
    is_deleted = models.BooleanField(default=False)
    history = HistoricalRecords()

    def __str__(self):
        title = truncate(self.title, 50)
        body = truncate(self.body, 200)
        separator = " --- " if body else ""

        return f"{title}{separator}{body}"

    def save(self, **kwargs):
        if self.id:
            self.is_edited = True
        super().save(**kwargs)

    def delete(self):
        self.is_deleted = True
        self.save()


class Tag(models.Model):
    """A user-facing, semantic category a post can be placed in."""

    name = models.CharField(null=False, blank=False)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="tags"
    )
    history = HistoricalRecords()

    def __str__(self):
        return f"{self.name} -- {self.post.title}"


class Reply(models.Model):
    """A reply to a Post."""

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="replies"
    )
    body = models.TextField(null=False, blank=False)
    date_posted = models.DateTimeField(auto_now_add=True)
    date_edited = models.DateTimeField(auto_now=True)
    is_edited = models.BooleanField(default=False)
    history = HistoricalRecords()

    def __str__(self):
        return f"{self.author.username}: {truncate(self.body, 250)}"

    def save(self, **kwargs):
        if self.id:
            self.is_edited = True
        super().save(**kwargs)
