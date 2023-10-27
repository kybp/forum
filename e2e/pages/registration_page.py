from faker import Faker
from playwright.sync_api import Page

from e2e import config
from .base_page import BasePage

fake = Faker()


class RegistrationPage(BasePage):
    def __init__(self, page: Page):
        self.page = page

    @property
    def form(self):
        return self.page.get_by_test_id("registration-form").locator("form")

    @property
    def username_input(self):
        return self.form.get_by_placeholder("Username")

    @property
    def email_input(self):
        return self.form.get_by_placeholder("Email")

    @property
    def password_input(self):
        return self.form.get_by_placeholder("Password").nth(0)

    @property
    def password_confirmation_input(self):
        return self.form.get_by_placeholder("Password").nth(1)

    @property
    def register_button(self):
        return self.form.get_by_role("button", name="Register")

    def register(self, username=None, email=None):
        if username is None:
            username = fake.email()
        if email is None:
            email = fake.email()

        self.username_input.fill(username)
        self.email_input.fill(email)
        self.password_input.fill(config.PASSWORD)
        self.password_confirmation_input.fill(config.PASSWORD)
        self.register_button.click()

        return [username, config.PASSWORD]
