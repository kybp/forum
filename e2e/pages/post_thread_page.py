from playwright.sync_api import Page
from typing import Iterable

from e2e import config
from .base_page import BasePage
from .post_form import PostForm
from .post_thread_data import PostThreadData
from .thread_detail_page import ThreadDetailPage


class PostThreadPage(BasePage):
    def __init__(self, page: Page):
        self.page = page
        self.form = PostForm(self.page)

    def navigate(self):
        self.page.goto(f"{config.HOST}/threads/new")

    def post_thread(
        self, title: str, body: str, tags: Iterable[str], images: Iterable[str]
    ) -> PostThreadData:
        self.form.title_input.fill(title)
        self.form.body_input.fill(body)
        self.form.add_tags(tags)
        self.form.add_images(images)

        image_urls = self.form.insert_images()
        data = PostThreadData(image_urls=image_urls)
        self.form.submit_button.click()

        thread_detail_page = ThreadDetailPage(self.page)
        thread_detail_page.author.wait_for()

        return data
