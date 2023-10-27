from django.contrib import admin

from .models import Post, Reply, Reaction, Tag


admin.site.register(Post)
admin.site.register(Reply)
admin.site.register(Reaction)
admin.site.register(Tag)
