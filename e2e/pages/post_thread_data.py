from dataclasses import dataclass


@dataclass
class PostThreadData:
    """Information pulled from the page when creating a thread."""

    image_urls: list[str]
