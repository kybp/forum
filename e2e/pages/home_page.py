from playwright.sync_api import Page

from e2e import config


class HomePage:
    def __init__(self, page: Page):
        self.page = page
        self.page.goto(config.HOST)

    @property
    def sign_in_button(self):
        return self.page.get_by_role("button", name="Sign in")

    @property
    def sign_out_button(self):
        return self.page.get_by_role("button", name="Sign out")

    @property
    def register_button(self):
        return self.page.get_by_role("button", name="Register")

    @property
    def username_input(self):
        return self.page.get_by_role("textbox", name="Username")

    @property
    def email_input(self):
        return self.page.get_by_role("textbox", name="Email")

    @property
    def password_input(self):
        return self.page.get_by_role("textbox", name="Password")

    def register(self):
        self.register_button.click()
        self.username_input.fill(config.UNUSED_USERNAME)
        self.email_input.fill(config.UNUSED_EMAIL)
        self.password_input.fill(config.PASSWORD)
        self.register_button.click()

        return [config.UNUSED_USERNAME, config.PASSWORD]

    def sign_in(self):
        self.username_input.fill(config.USERNAME)
        self.password_input.fill(config.PASSWORD)
        self.sign_in_button.click()

    def sign_out(self):
        self.sign_out_button.click()
