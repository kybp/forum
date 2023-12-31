import time
from playwright.sync_api import Page

from .base_page import BasePage


class AccountPage(BasePage):
    def __init__(self, page: Page):
        self.page = page

    @property
    def delete_button(self):
        return self.page.get_by_role("button", name="Delete Account")

    @property
    def password_input(self):
        return self.page.get_by_placeholder("Password")

    @property
    def confirm_delete_button(self):
        return self.page.get_by_role("button", name="Delete Forever")

    def select_theme(self, theme):
        self.page.locator("select").select_option(theme)
        # Give a moment for the styles to be applied
        time.sleep(0.1)

    def delete_account(self, password: str):
        self.delete_button.click()
        self.password_input.fill(password)
        self.confirm_delete_button.click()
