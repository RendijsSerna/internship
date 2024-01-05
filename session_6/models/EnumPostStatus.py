import enum


class EnumPostStatus(str, enum.Enum):
    not_set = 'not_set'
    draft = 'draft'
    published = 'published'
    deleted = 'deleted'
