from django.db import migrations
from django.core.files.base import ContentFile
import requests
import re


def update_imgur_urls(apps, schema_editor):
    Post = apps.get_model("threads", "Post")
    PostImage = apps.get_model("threads", "PostImage")

    imgur_url_pattern = re.compile(r"(?<=\()https://i\.imgur\.com/.*(?=\))")

    for post in Post.objects.all():
        if post.body:

            def replace_imgur_url(match):
                imgur_url = match.group(0)
                try:
                    # We need to set user agent to something or else imgur gives us a 429
                    response = requests.get(
                        imgur_url, headers={"User-agent": "some agent"}
                    )
                    response.raise_for_status()

                    post_image = PostImage(post=post)
                    post_image.image.save(
                        f"{post.id}_{imgur_url.split('/')[-1]}",
                        ContentFile(response.content),
                    )

                    return post_image.image.url
                except Exception as e:
                    print(f"Failed to download {imgur_url}: {e}")
                    # Retain original URL on failure
                    return imgur_url

            new_body = imgur_url_pattern.sub(replace_imgur_url, post.body)
            if new_body != post.body:
                post.body = new_body
                post.save()


class Migration(migrations.Migration):
    dependencies = [
        ("threads", "0008_postimage"),
    ]

    operations = [
        migrations.RunPython(update_imgur_urls),
    ]
