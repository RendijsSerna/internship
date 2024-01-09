from dataclasses import dataclass


@dataclass
class ModelTag:
    tags_id: int = 0
    name: str = ""
    post_id: int = 0
