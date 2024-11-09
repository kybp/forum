from playwright.sync_api import Page
from typing import Iterable

from .base_page import BasePage


class PostForm(BasePage):
    def __init__(self, page: Page):
        self.page = page

    @property
    def form(self):
        return self.page.get_by_test_id("post-form")

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
    def preview(self):
        return self.page.get_by_test_id("preview")

    @property
    def images(self):
        return self.form.locator('input[type="image"]')

    @property
    def toggle_preview_button(self):
        return self.page.get_by_role("button", name="Preview")

    @property
    def submit_button(self):
        return self.form.get_by_role("button", name="Submit").last

    def add_tags(self, tags: Iterable[str]):
        self.add_tag_button.click()
        for tag in tags:
            self.last_tag_input.fill(tag)
            self.add_tag_button.click()

    def add_images(self, images: Iterable[str]):
        self.page.get_by_test_id("images-input").set_input_files(images)

    def insert_images(self):
        image_urls = []

        for image in self.images.all():
            image_urls.append(image.get_attribute("src"))
            image.click()
            self.paste()

        return image_urls

    def paste(self):
        self.body_input.focus()
        self.body_input.press("Control+V")

    def toggle_preview(self):
        self.toggle_preview_button.click()
