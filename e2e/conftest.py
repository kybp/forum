import pytest


@pytest.fixture
def browser_context_args():
    return {
        "ignore_https_errors": True,
        "permissions": ["clipboard-read", "clipboard-write"],
    }
