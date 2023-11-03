from playwright.sync_api import Page, expect

from e2e import config
from e2e.pages.account_page import AccountPage
from e2e.pages.home_page import HomePage
from e2e.pages.post_thread_page import PostThreadPage
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


def test_error_when_signing_in_with_bad_credentials(page: Page):
    home_page = HomePage(page)

    expect(home_page.field_error).to_be_hidden()
    home_page.sign_in(password=f"{config.PASSWORD} and more")
    expect(home_page.sign_out_button).to_be_hidden()
    expect(home_page.field_error).to_be_visible()


def test_redirected_back_after_sign_in(page: Page):
    post_thread_page = PostThreadPage(page)
    post_thread_page.navigate()
    expect(post_thread_page.unauthorised).to_be_visible()
    post_thread_page.sign_in()
    expect(post_thread_page.form.body_input).to_be_visible()


def test_sign_in_errors_are_cleared_when_navigating_to_new_page(page: Page):
    home_page = HomePage(page)

    # Create a thread so we have somewhere to navigate to
    home_page.sign_in()
    title = "a great title"
    home_page.post_thread(title=title)
    home_page.sign_out()

    # Get an error on the form
    expect(home_page.field_error).to_be_hidden()
    home_page.sign_in(password=f"{config.PASSWORD} and more")
    expect(home_page.field_error).to_be_visible()

    home_page.go_to_home_page()
    expect(home_page.field_error).to_be_hidden()


def test_changing_theme(page: Page):
    home_page = HomePage(page)
    home_page.sign_in()
    home_page.go_to_account_page()
    account_page = AccountPage(page)

    account_page.select_theme("light")
    light_background_color = account_page.background_color
    account_page.select_theme("dark")
    dark_background_color = account_page.background_color

    assert light_background_color != dark_background_color


def test_deleting_account(page: Page):
    home_page = HomePage(page)

    username, password = home_page.register()
    home_page.go_to_account_page()
    account_page = AccountPage(page)

    account_page.delete_account(password=password)

    expect(home_page.sign_in_button).to_be_visible()
    home_page.sign_in(username=username, password=password)
    expect(home_page.sign_in_button).to_be_visible()
    expect(home_page.field_error).to_be_visible()
