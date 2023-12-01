from playwright.sync_api import Page, expect

from e2e import config


def test_not_found_route(page: Page):
    page.goto(f"{config.HOST}/some/invalid/route")
    not_found = page.get_by_role("heading", name="Not found")
    expect(not_found).to_be_visible()
