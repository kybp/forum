from playwright.sync_api import Page, expect

from e2e.pages.account_page import AccountPage
from e2e.pages.edit_post_page import EditPostPage
from e2e.pages.edit_reply_page import EditReplyPage
from e2e.pages.home_page import HomePage
from e2e.pages.post_thread_page import PostThreadPage
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

    thread_detail_page = ThreadDetailPage(page)
    body = "A well thought-out response"
    thread_detail_page.reply(body)

    # Check that the input is cleared
    expect(thread_detail_page.reply_input).to_have_value("")
    # Check that the reply is added to the page
    expect(thread_detail_page.first_reply_author).to_have_text(username)
    expect(thread_detail_page.first_reply_body).to_have_text(body)


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
    other_author_title = "my title"
    home_page.post_thread(title=other_author_title)
    home_page.go_to_home_page()

    home_page.sign_out()

    expect(home_page.newest_thread_title).to_have_text(default_author_title)


def test_viewing_thread_by_deleted_user(page: Page):
    home_page = HomePage(page)

    _, password = home_page.register()
    home_page.post_thread()
    home_page.go_to_account_page()
    AccountPage(page).delete_account(password=password)

    home_page.sign_in()
    home_page.go_to_home_page()
    expect(home_page.post_thread_button).to_be_visible()
    home_page.open_thread()

    expect(ThreadDetailPage(page).author).to_have_text("[deleted]")


def test_deleting_posts_and_replies(page: Page):
    home_page = HomePage(page)

    home_page.sign_in()
    title = "framework"
    home_page.post_thread(title=title)

    thread_detail_page = ThreadDetailPage(page)
    body = "very informative"
    thread_detail_page.reply(body=body)

    thread_detail_page.delete_first_reply()
    expect(thread_detail_page.first_reply).to_be_hidden()

    thread_detail_page.delete_post()
    expect(thread_detail_page.author).to_have_text("[deleted]")
    expect(thread_detail_page.body).to_have_text("[deleted]")


def test_editing_post(page: Page):
    home_page = HomePage(page)

    home_page.sign_in()
    old_title, old_body = "old title", "old body"
    home_page.post_thread(title=old_title, body=old_body)

    thread_detail_page = ThreadDetailPage(page)
    expect(thread_detail_page.edited).to_be_hidden()
    new_title, new_body = "new title", "new body"
    thread_detail_page.edit_post_button.click()
    edit_post_page = EditPostPage(page)

    # Check that form populates from DB
    expect(edit_post_page.form.title_input).to_have_value(old_title)
    expect(edit_post_page.form.body_input).to_have_value(old_body)

    edit_post_page.edit(title=new_title, body=new_body)
    thread_detail_page.author.wait_for()

    # Check updates
    expect(thread_detail_page.edited).to_be_visible()
    expect(thread_detail_page.title).to_have_text(new_title)
    expect(thread_detail_page.body).to_have_text(new_body)


def test_editing_reply(page: Page):
    home_page = HomePage(page)

    home_page.sign_in()
    home_page.post_thread()

    thread_detail_page = ThreadDetailPage(page)

    old_body = "some old text"
    thread_detail_page.reply(body=old_body)

    expect(thread_detail_page.first_reply_edited).to_be_hidden()
    thread_detail_page.edit_first_reply_button.click()
    edit_reply_page = EditReplyPage(page)

    # Check that form populates from DB
    expect(edit_reply_page.body_input).to_have_value(old_body)

    new_body = "some new text"
    edit_reply_page.edit(body=new_body)
    thread_detail_page.author.wait_for()

    # Check update
    expect(thread_detail_page.first_reply_edited).to_be_visible()
    expect(thread_detail_page.first_reply_body).to_have_text(new_body)
