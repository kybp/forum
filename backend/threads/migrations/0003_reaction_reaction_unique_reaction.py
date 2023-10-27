# Generated by Django 4.2.5 on 2023-10-27 09:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("contenttypes", "0002_remove_content_type_name"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("threads", "0002_reply"),
    ]

    operations = [
        migrations.CreateModel(
            name="Reaction",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("like", "like"),
                            ("laugh", "laugh"),
                            ("confused", "confused"),
                        ]
                    ),
                ),
                ("object_id", models.PositiveIntegerField()),
                ("date_created", models.DateTimeField(auto_now_add=True)),
                (
                    "content_type",
                    models.ForeignKey(
                        help_text="The type of content that was being reacted to.",
                        on_delete=django.db.models.deletion.CASCADE,
                        to="contenttypes.contenttype",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        help_text="The user who made the reaction.",
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "indexes": [
                    models.Index(
                        fields=["content_type", "object_id"],
                        name="threads_rea_content_362dd0_idx",
                    )
                ],
            },
        ),
        migrations.AddConstraint(
            model_name="reaction",
            constraint=models.UniqueConstraint(
                fields=("user_id", "object_id"), name="unique_reaction"
            ),
        ),
    ]
