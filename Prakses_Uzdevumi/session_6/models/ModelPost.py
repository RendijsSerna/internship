from dataclasses import dataclass
from typing import List

from models import ModelTag
from models.EnumPostStatus import EnumPostStatus


@dataclass
class ModelPost:
    post_id: int = 0
    url_slug: str = ""
    title: str = ""
    body: str = ""
    thumbnail_uuid: str = ""
    created: int = 0
    modified: int = 0
    status: EnumPostStatus = EnumPostStatus.not_set  # ALT + ENTER
    is_deleted: int = 0

    parent_post_id: int = None
    children_posts = []
    depth: int = 0

