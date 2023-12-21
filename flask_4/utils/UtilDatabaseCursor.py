import sqlite3


class UtilDatabaseCursor:

    def __init__(self):
        super().__init__()
        self.conn = sqlite3.connect("./blog.sqlite")
        self.cursor = None

    def __enter__(self):
        self.conn.__enter__()
        self.cursor = self.conn.cursor()
        return self.cursor

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cursor.close()
        self.conn.__exit__(exc_type, exc_val, exc_tb)


