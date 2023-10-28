from playwright.sync_api import Page, expect

from e2e.pages.account_page import AccountPage
from e2e.pages.home_page import HomePage
from e2e.pages.thread_detail_page import ThreadDetailPage


def test_posting_a_thread(page: Page):
    home_page = HomePage(page)

    expect(home_page.post_thread_button).to_be_hidden()
    username = home_page.sign_in()
    expect(home_page.post_thread_button).to_be_visible()
    title, body = "some title", "some body"
    tags = "good", "better"
    home_page.post_thread(title, body, tags)
    thread_page = ThreadDetailPage(page)

    expect(thread_page.author).to_have_text(username)
    expect(thread_page.title).to_have_text(title)
    expect(thread_page.body).to_have_text(body)
    expect(thread_page.tags).to_contain_text(tags[0])
    expect(thread_page.tags).to_contain_text(tags[1])


def test_created_threads_appear_in_list(page: Page):
    home_page = HomePage(page)

    home_page.sign_in()
    title = "a great title"
    tags = "cool", "tags"
    home_page.post_thread(title=title, tags=tags)
    home_page.go_to_home_page()

    expect(home_page.newest_thread_title).to_have_text(title)
    expect(home_page.newest_thread_tags).to_contain_text(tags[0])
    expect(home_page.newest_thread_tags).to_contain_text(tags[1])

    home_page.open_thread(title)
    expect(ThreadDetailPage(page).title).to_have_text(title)


def test_replying_to_a_thread(page: Page):
    home_page = HomePage(page)

    username = home_page.sign_in()
    home_page.post_thread()

    thread_page = ThreadDetailPage(page)
    body = "A well thought-out response"
    thread_page.reply(body)

    # Check that the input is cleared
    expect(thread_page.reply_input).to_have_value("")
    # Check that the reply is added to the page
    expect(thread_page.first_reply_author).to_have_text(username)
    expect(thread_page.first_reply_body).to_have_text(body)


def test_posts_and_replies_support_markdown(page: Page):
    markdown = "# Header"
    home_page = HomePage(page)

    home_page.sign_in()
    home_page.post_thread(body=markdown)
    thread_page = ThreadDetailPage(page)

    expect(thread_page.body.locator("h1")).to_be_visible()

    thread_page.reply(markdown)
    expect(thread_page.first_reply_body.locator("h1")).to_be_visible()


def test_liking_a_post(page: Page):
    home_page = HomePage(page)

    home_page.sign_in()
    title = "a great title"
    home_page.post_thread(title=title)
    thread_page = ThreadDetailPage(page)

    # You can't like your own post
    expect(thread_page.like_button).to_be_hidden()

    # Sign in as other user
    thread_page.sign_out()
    thread_page.go_to_home_page()
    home_page.register()
    home_page.go_to_home_page()
    home_page.open_thread(title=title)

    thread_page.like_thread()
    expect(thread_page.likes).to_have_text("1")
    thread_page.unlike_thread()
    expect(thread_page.likes).to_have_text("")


def test_thread_filtering(page: Page):
    home_page = HomePage(page)

    home_page.sign_in()
    default_author_title = "a worthy title"
    home_page.post_thread(title=default_author_title)
    home_page.sign_out()

    home_page.register()
    home_page.go_to_home_page()
    other_author_title = "my title"
    home_page.post_thread(title=other_author_title)
    home_page.go_to_home_page()

    home_page.sign_out()
    page.reload()

    expect(home_page.newest_thread_title).to_have_text(default_author_title)


def test_viewing_thread_by_deleted_user(page: Page):
    home_page = HomePage(page)

    _, password = home_page.register()
    home_page.go_to_home_page()
    home_page.post_thread()
    home_page.go_to_account_page()
    AccountPage(page).delete_account(password=password)

    home_page.sign_in()
    home_page.go_to_home_page()
    home_page.open_thread(home_page.newest_thread_title.text_content())

    expect(ThreadDetailPage(page).author).to_have_text("[deleted]")
