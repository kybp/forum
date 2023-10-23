from faker import Faker
from playwright.sync_api import Page

from e2e import config

fake = Faker()


class RegistrationPage:
    def __init__(self, page: Page):
        self.page = page

    @property
    def form(self):
        return self.page.locator("form").filter(has_text="Register")

    @property
    def username_input(self):
        return self.form.get_by_placeholder("Username")

    @property
    def email_input(self):
        return self.form.get_by_placeholder("Email")

    @property
    def password_input(self):
        return self.form.get_by_placeholder("Password")

    @property
    def register_button(self):
        return self.form.get_by_role("button", name="Register")

    @property
    def field_error(self):
        return self.form.get_by_role("alert")

    def register(self, username=config.UNUSED_USERNAME, email=None):
        if email is None:
            email = fake.email()
        self.username_input.fill(username)
        self.email_input.fill(email)
        self.password_input.fill(config.PASSWORD)
        self.register_button.click()

        return [username, config.PASSWORD]
