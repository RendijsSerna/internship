import uuid


class UtilStrings:

    @staticmethod
    def generate_random_uuid():
        return str(uuid.uuid4())
