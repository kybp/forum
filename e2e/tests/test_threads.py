from playwright.sync_api import Page, expect

from e2e.pages.home_page import HomePage
from e2e.pages.thread_detail_page import ThreadDetailPage


def test_posting_a_thread(page: Page):
    home_page = HomePage(page)

    expect(home_page.post_thread_button).to_be_hidden()
    username = home_page.sign_in()
    expect(home_page.post_thread_button).to_be_visible()
    title, body = "some title", "some body"
    home_page.post_thread(title, body)
    thread_page = ThreadDetailPage(page)

    expect(thread_page.author).to_have_text(username)
    expect(thread_page.title).to_have_text(title)
    expect(thread_page.body).to_have_text(body)


def test_created_threads_appear_in_list(page: Page):
    home_page = HomePage(page)

    home_page.sign_in()
    title = "a great title"
    home_page.post_thread(title=title)
    home_page.go_to_home_page()

    home_page.open_thread(title)
    expect(ThreadDetailPage(page).title).to_have_text(title)


def test_replying_to_a_thread(page: Page):
    home_page = HomePage(page)

    username = home_page.sign_in()
    home_page.post_thread()

    thread_page = ThreadDetailPage(page)
    body = "A well thought-out response"
    thread_page.reply(body)

    expect(thread_page.first_reply_author).to_have_text(username)
    expect(thread_page.first_reply_body).to_have_text(body)
