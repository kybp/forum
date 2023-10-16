from playwright.sync_api import Page, expect

from e2e.pages.home_page import HomePage


def test_registering(page: Page):
    home_page = HomePage(page)

    username, password = home_page.register()
    home_page.sign_out()
    home_page.sign_in(username, password)
    expect(home_page.sign_out_button).to_be_visible()


def test_signing_in_and_out(page: Page):
    home_page = HomePage(page)

    expect(home_page.sign_out_button).to_be_hidden()
    home_page.sign_in()
    expect(home_page.sign_out_button).to_be_visible()
    home_page.sign_out()
    expect(home_page.sign_out_button).to_be_hidden()
