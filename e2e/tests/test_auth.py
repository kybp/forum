from playwright.sync_api import Page, expect

from e2e import config
from e2e.pages.home_page import HomePage
from e2e.pages.registration_page import RegistrationPage


def test_registering(page: Page):
    home_page = HomePage(page)

    username, password = home_page.register()
    home_page.sign_out()
    home_page.sign_in(username, password)
    expect(home_page.sign_out_button).to_be_visible()


def test_error_when_registering_existing_username(page: Page):
    home_page = HomePage(page)
    registration_page = RegistrationPage(page)

    expect(registration_page.field_error).to_be_hidden()
    home_page.register(username=config.USERNAME)
    expect(home_page.sign_out_button).to_be_hidden()
    registration_page = RegistrationPage(page)
    expect(registration_page.field_error).to_be_visible()


def test_signing_in_and_out(page: Page):
    home_page = HomePage(page)

    expect(home_page.sign_out_button).to_be_hidden()
    home_page.sign_in()
    expect(home_page.sign_out_button).to_be_visible()
    home_page.sign_out()
    expect(home_page.sign_out_button).to_be_hidden()
