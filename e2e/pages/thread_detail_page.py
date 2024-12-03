from playwright.sync_api import Page

from .base_page import BasePage


class ThreadDetailPage(BasePage):
    def __init__(self, page: Page):
        self.page = page

    @property
    def author(self):
        return self.page.get_by_test_id("author").first

    @property
    def title(self):
        return self.page.get_by_test_id("thread-detail-title")

    @property
    def edited(self):
        return self.page.get_by_test_id("edited").first

    @property
    def body(self):
        return self.page.get_by_test_id("body")

    @property
    def images(self):
        images = self.body.locator("img").all()
        return [image.get_attribute("src") for image in images]

    @property
    def tags(self):
        return self.page.get_by_test_id("tags")

    @property
    def delete_post_button(self):
        return self.page.get_by_role("button", name="Delete").first

    @property
    def first_reply(self):
        return self.page.get_by_test_id("reply-0")

    @property
    def first_reply_author(self):
        return self.first_reply.get_by_test_id("author")

    @property
    def first_reply_body(self):
        return self.first_reply.get_by_test_id("body")

    @property
    def first_reply_edited(self):
        return self.first_reply.get_by_test_id("edited")

    @property
    def edit_first_reply_button(self):
        return self.first_reply.get_by_role("link", name="Edit").first

    @property
    def delete_first_reply_button(self):
        return self.first_reply.get_by_role("button", name="Delete")

    @property
    def reply_input(self):
        return self.page.get_by_role("textbox", name="Reply")

    @property
    def reply_preview(self):
        return self.page.get_by_test_id("preview")

    @property
    def submit_reply_button(self):
        return self.page.get_by_role("button", name="Submit")

    @property
    def likes(self):
        return self.page.get_by_test_id("likes")

    @property
    def like_button(self):
        return self.page.get_by_role("button", name="👍")

    @property
    def previous_page_button(self):
        return self.page.get_by_test_id("previous-page")

    @property
    def next_page_button(self):
        return self.page.get_by_test_id("next-page")

    @property
    def toggle_preview_button(self):
        return self.page.get_by_role("button", name="Preview")

    @property
    def edit_post_button(self):
        return self.page.get_by_role("link", name="Edit").first

    def toggle_preview(self):
        self.toggle_preview_button.click()

    def like_thread(self):
        self.like_button.click()

    def unlike_thread(self):
        # It's just a toggle for now
        self.like_thread()

    def previous_page(self):
        self.previous_page_button.click()

    def next_page(self):
        self.next_page_button.click()

    def reply(self, body: str = "some response message"):
        self.reply_input.fill(body)
        self.submit_reply_button.click()

    def delete_post(self):
        self.delete_post_button.click()

    def delete_first_reply(self):
        self.delete_first_reply_button.click()
