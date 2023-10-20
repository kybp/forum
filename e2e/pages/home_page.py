from playwright.sync_api import Page

from e2e import config
from .post_thread_page import PostThreadPage
from .registration_page import RegistrationPage


class HomePage:
    def __init__(self, page: Page):
        self.page = page
        self.page.goto(config.HOST)

    def go_to_registration_page(self):
        self.page.get_by_role("link", name="Register").click()
        return RegistrationPage(self.page)

    @property
    def header(self):
        return self.page.get_by_role("banner")

    @property
    def sign_in_button(self):
        return self.header.get_by_role("button", name="Sign in")

    @property
    def sign_out_button(self):
        return self.header.get_by_role("button", name="Sign out")

    @property
    def register_button(self):
        return self.header.get_by_role("button", name="Register")

    @property
    def username_input(self):
        return self.header.get_by_role("textbox", name="Username")

    @property
    def email_input(self):
        return self.header.get_by_role("textbox", name="Email")

    @property
    def password_input(self):
        return self.header.get_by_role("textbox", name="Password")

    @property
    def post_thread_button(self):
        return self.page.get_by_role("link", name="New Thread")

    def register(self):
        registration_page = self.go_to_registration_page()
        username, password = registration_page.register()
        return [username, password]

    def sign_in(self, username=config.USERNAME, password=config.PASSWORD):
        self.username_input.fill(username)
        self.password_input.fill(password)
        self.sign_in_button.click()

        return username

    def sign_out(self):
        self.sign_out_button.click()

    def post_thread(self, title: str, body: str):
        self.post_thread_button.click()
        post_thread_page = PostThreadPage(self.page)
        post_thread_page.post_thread(title, body)
