# Generated by Django 4.2.6 on 2023-11-03 08:47

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("threads", "0006_historicaltag_historicalreply_historicalpost"),
    ]

    operations = [
        migrations.AddField(
            model_name="historicalpost",
            name="date_edited",
            field=models.DateTimeField(
                blank=True,
                default=datetime.datetime(
                    2023,
                    11,
                    3,
                    8,
                    47,
                    19,
                    766751,
                    tzinfo=datetime.timezone.utc,
                ),
                editable=False,
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="historicalpost",
            name="is_edited",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="historicalreply",
            name="date_edited",
            field=models.DateTimeField(
                blank=True,
                default=datetime.datetime(
                    2023,
                    11,
                    3,
                    8,
                    47,
                    30,
                    800459,
                    tzinfo=datetime.timezone.utc,
                ),
                editable=False,
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="historicalreply",
            name="is_edited",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="post",
            name="date_edited",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name="post",
            name="is_edited",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="reply",
            name="date_edited",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name="reply",
            name="is_edited",
            field=models.BooleanField(default=False),
        ),
    ]
