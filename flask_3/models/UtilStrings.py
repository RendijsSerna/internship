import re


class UtilStrings:
    @staticmethod
    def slugify(s):
        s = s.lower().strip()
        # replaces special chars with ''
        s = re.sub(r'[^\w\s-]', '', s)
        # replaces spaces with  one -
        s = re.sub(r'[\s_-]+', '-', s)
        # replaces any - at the front or end of string
        s = re.sub(r'^-+|-+$', '', s)
        return s