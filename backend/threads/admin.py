from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from .models import Post, Reply, Reaction, Tag


@admin.register(Post)
class PostAdmin(SimpleHistoryAdmin):
    pass


@admin.register(Reply)
class ReplyAdmin(SimpleHistoryAdmin):
    pass


admin.site.register(Reaction)
admin.site.register(Tag)
