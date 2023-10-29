from playwright.sync_api import Page
from typing import Iterable

from e2e import config
from .base_page import BasePage
from .thread_detail_page import ThreadDetailPage


class PostThreadPage(BasePage):
    def __init__(self, page: Page):
        self.page = page

    def navigate(self):
        self.page.goto(f"{config.HOST}/post")

    @property
    def form(self):
        return self.page.get_by_test_id("post-form").locator("form")

    @property
    def title_input(self):
        return self.form.get_by_role("textbox", name="Title")

    @property
    def body_input(self):
        return self.form.get_by_role("textbox", name="Body")

    @property
    def last_tag_input(self):
        return self.page.get_by_role("textbox", name="Tag").last

    @property
    def add_tag_button(self):
        return self.page.get_by_role("button", name="+")

    @property
    def submit_button(self):
        return self.form.get_by_role("button", name="Submit")

    def add_tags(self, tags: Iterable[str]):
        self.add_tag_button.click()
        for tag in tags:
            self.last_tag_input.fill(tag)
            self.add_tag_button.click()

    def post_thread(self, title: str, body: str, tags: Iterable[str]):
        self.title_input.fill(title)
        self.body_input.fill(body)
        self.add_tags(tags)
        self.submit_button.click()

        thread_detail_page = ThreadDetailPage(self.page)
        thread_detail_page.author.wait_for()
