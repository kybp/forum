from playwright.sync_api import Page


class ThreadDetailPage:
    def __init__(self, page: Page):
        self.page = page

    @property
    def author(self):
        return self.page.get_by_test_id("author")

    @property
    def title(self):
        return self.page.get_by_test_id("title")

    @property
    def body(self):
        return self.page.get_by_test_id("body")

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
    def reply_input(self):
        return self.page.get_by_role("textbox", name="Reply")

    @property
    def submit_reply_button(self):
        return self.page.get_by_role("button", name="Submit")

    def reply(self, body: str = "some response message"):
        self.reply_input.fill(body)
        self.submit_reply_button.click()
