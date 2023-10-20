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
