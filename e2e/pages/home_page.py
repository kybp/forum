from faker import Faker
from playwright.sync_api import Page

from e2e import config
from .base_page import BasePage
from .post_thread_data import PostThreadData
from .post_thread_page import PostThreadPage
from .registration_page import RegistrationPage

fake = Faker()


class HomePage(BasePage):
    def __init__(self, page: Page, navigate=True):
        self.page = page

        if navigate:
            self.page.goto(config.HOST)

    @property
    def post_thread_button(self):
        return self.page.get_by_role("link", name="New Thread")

    @property
    def newest_thread(self):
        return self.page.get_by_test_id("thread").first

    @property
    def newest_thread_title(self):
        return self.newest_thread.get_by_role("link").first

    @property
    def newest_thread_tags(self):
        return self.newest_thread.get_by_test_id("tags")

    def register(self, username=None, email=None):
        if username is None:
            username = fake.email()
        if email is None:
            email = fake.email()

        self.go_to_registration_page()
        registration_page = RegistrationPage(self.page)

        username, password = registration_page.register(username, email)
        return [username, password]

    def post_thread(
        self, title: str = "title", body: str = "body", tags=[], images=[]
    ) -> PostThreadData:
        self.post_thread_button.click()
        post_thread_page = PostThreadPage(self.page)
        return post_thread_page.post_thread(title, body, tags, images)

    def open_thread(self, title=None):
        if title is None:
            title = self.newest_thread_title.text_content()

        self.page.get_by_role("link", name=title).first.click()
