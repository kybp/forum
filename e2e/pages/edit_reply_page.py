from playwright.sync_api import Page
from typing import Optional

from .base_page import BasePage


class EditReplyPage(BasePage):
    def __init__(self, page: Page):
        self.page = page

    @property
    def body_input(self):
        return self.page.get_by_role("textbox", name="Reply")

    @property
    def submit_button(self):
        return self.page.get_by_role("button", name="Submit")

    def edit(self, body: Optional[str] = None):
        if body:
            self.body_input.fill(body)

        self.submit_button.click()
