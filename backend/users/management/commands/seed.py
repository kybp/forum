import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Add starter data for e2e specs"

    def handle(self, *args, **kwargs):
        get_user_model().objects.create_user(
            username=os.environ["E2E_USERNAME"],
            email=os.environ["E2E_EMAIL"],
            password=os.environ["E2E_PASSWORD"],
        )
