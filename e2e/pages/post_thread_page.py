from playwright.sync_api import Page


class PostThreadPage:
    def __init__(self, page: Page):
        self.page = page

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
    def submit_button(self):
        return self.form.get_by_role("button", name="Submit")

    def post_thread(self, title: str, body: str):
        self.title_input.fill(title)
        self.body_input.fill(body)
        self.submit_button.click()
