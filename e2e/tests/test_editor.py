from playwright.sync_api import Page, expect

from e2e.pages.home_page import HomePage
from e2e.pages.post_thread_page import PostThreadPage
from e2e.pages.thread_detail_page import ThreadDetailPage


IMAGES = [f"assets/{path}" for path in ["image.png", "image.jpg", "image.gif"]]


def test_posts_and_replies_support_markdown(page: Page):
    markdown = "# Header"
    home_page = HomePage(page)

    home_page.sign_in()
    home_page.post_thread(body=markdown)
    thread_page = ThreadDetailPage(page)

    expect(thread_page.body.locator("h1")).to_be_visible()

    thread_page.reply(markdown)
    expect(thread_page.first_reply_body.locator("h1")).to_be_visible()


def test_post_markdown_preview(page: Page):
    home_page = HomePage(page)

    home_page.sign_in()
    home_page.post_thread_button.click()
    post_thread_page = PostThreadPage(page)

    post_thread_page.form.body_input.fill("# Header")

    expect(post_thread_page.form.preview).to_be_visible()
    markdown = post_thread_page.form.preview.get_by_role(
        "heading", name="Header"
    )
    expect(markdown).to_be_visible()


def test_post_markdown_preview_is_a_toggle_on_mobile(page: Page):
    page.set_viewport_size({"width": 400, "height": 500})
    home_page = HomePage(page)

    home_page.sign_in()
    home_page.post_thread_button.click()
    post_thread_page = PostThreadPage(page)

    post_thread_page.form.body_input.fill("# Header")
    expect(post_thread_page.form.preview).to_be_hidden()
    post_thread_page.form.toggle_preview()

    # Preview is visible
    expect(post_thread_page.form.preview).to_be_visible()
    markdown = post_thread_page.form.preview.get_by_role(
        "heading", name="Header"
    )
    expect(markdown).to_be_visible()

    # Form is not visible
    expect(post_thread_page.form.body_input).to_be_hidden()

    # Toggle back
    post_thread_page.form.toggle_preview()
    expect(post_thread_page.form.body_input).to_be_visible()
    expect(post_thread_page.form.preview).to_be_hidden()


def test_reply_markdown_preview(page: Page):
    home_page = HomePage(page)

    home_page.sign_in()
    home_page.post_thread()
    thread_detail_page = ThreadDetailPage(page)

    thread_detail_page.reply_input.fill("# Header")

    expect(thread_detail_page.reply_preview).to_be_visible()
    markdown = thread_detail_page.reply_preview.get_by_role(
        "heading", name="Header"
    )
    expect(markdown).to_be_visible()


def test_reply_markdown_preview_is_a_toggle_on_mobile(page: Page):
    page.set_viewport_size({"width": 400, "height": 500})
    home_page = HomePage(page)

    home_page.sign_in()
    home_page.post_thread()
    thread_detail_page = ThreadDetailPage(page)

    thread_detail_page.reply_input.fill("# Header")
    expect(thread_detail_page.reply_preview).to_be_hidden()
    thread_detail_page.toggle_preview()

    # Preview is visible
    expect(thread_detail_page.reply_preview).to_be_visible()
    markdown = thread_detail_page.reply_preview.get_by_role(
        "heading", name="Header"
    )
    expect(markdown).to_be_visible()

    # Form is not visible
    expect(thread_detail_page.reply_input).to_be_hidden()

    # Toggle back
    thread_detail_page.toggle_preview()
    expect(thread_detail_page.reply_input).to_be_visible()
    expect(thread_detail_page.reply_preview).to_be_hidden()
