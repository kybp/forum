from playwright.sync_api import Page
from typing import Optional

from .base_page import BasePage
from .post_form import PostForm


class EditPostPage(BasePage):
    def __init__(self, page: Page):
        self.page = page
        self.form = PostForm(self.page)

    def edit(self, title: Optional[str] = None, body: Optional[str] = None):
        if title:
            self.form.title_input.fill(title)

        if body:
            self.form.body_input.fill(body)

        self.form.submit_button.click()
