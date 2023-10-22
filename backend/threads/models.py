from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


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


class Reply(models.Model):
    """A reply to a Post."""

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="replies"
    )
    body = models.TextField(null=False, blank=False)
    date_posted = models.DateTimeField(auto_now_add=True)
