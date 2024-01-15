from models.ModelPost import ModelPost
import sqlite3

from models.ModelTag import ModelTag
from utils.UtilDatabaseCursor import UtilDatabaseCursor


class ControllerDatabase:

    @staticmethod
    def __connection():
        return sqlite3.connect("./blog.sqlite")

    @staticmethod
    def insert_post(post: ModelPost) -> int:
        post_id = 0
        try:
            with ControllerDatabase.__connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO posts (body, title, url_slug, parent_post_id) "
                    "VALUES (:title, :body, :url_slug, :parent_post_id);",
                    post.__dict__
                )
                post_id = cursor.execute("SELECT last_insert_rowid()").fetchone()[0]
                cursor.close()
        except Exception as exc:
            print(exc)
        return post_id

    @staticmethod
    def update_post(post: ModelPost):
        try:
            with ControllerDatabase.__connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "UPDATE posts SET (title, body, url_slug, parent_post_id) = "
                    "(:title, :body, :url_slug, :parent_post_id) WHERE post_id = :post_id",
                    post.__dict__

                )
                cursor.close()

        except Exception as exc:
            print(exc)

    @staticmethod
    def get_post(post_id: int = None, url_slug: str = None) -> ModelPost:
        post = None
        try:
            with ControllerDatabase.__connection() as conn:
                cursor = conn.cursor()
                if post_id:
                    query = cursor.execute(
                        "SELECT * FROM posts WHERE post_id = :post_id AND isDeleted = False LIMIT 1 ;",
                        {'post_id': post_id}
                    )
                else:
                    query = cursor.execute(
                        "SELECT * FROM posts WHERE url_slug = :url_slug  AND isDeleted = False  LIMIT 1;",
                        {'url_slug': url_slug}
                    )
                if query.rowcount:
                    col = query.fetchone()  # tuple of all * col values
                    post = ModelPost()  # instance of object

                    (
                        post.post_id,
                        post.title,
                        post.body,
                        post.created,
                        post.modified,
                        post.url_slug,
                        post.thumbnail_uuid,
                        post.status,
                        post.parent_post_id,
                        post.isDeleted
                    ) = col  # pythonic wat to copy one by one variable from one tuple to another tuple
                cursor.close()

                if post.parent_post_id is not None:
                    post.parent_post = ControllerDatabase.get_post(post_id=post.parent_post_id)

                post.children_post = ControllerDatabase.get_all_posts(parent_post_id=post.post_id)

        except Exception as exc:
            print(exc)
        return post

    @staticmethod
    def delete_post(post_id: int) -> bool:
        isSuccess = False
        try:
            with ControllerDatabase.__connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "UPDATE posts SET  (isDeleted) =   (TRUE) WHERE post_id = :post_id  ;",
                    [post_id]
                )
                isSuccess = True
        except Exception as exc:
            print(exc)
        return isSuccess

    @staticmethod
    def get_all_posts(parent_post_id=None) -> [ModelPost]:
        posts = []
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    f"SELECT post_id FROM posts WHERE parent_post_id {'' if parent_post_id else 'IS'} ?"
                    f" AND isDeleted = False",
                    [parent_post_id]
                )
                for post_id, in cursor.fetchall():
                    post = ControllerDatabase.get_post(post_id)

                    posts.append(post)
        except Exception as exc:
            print(exc)
        return posts

    @staticmethod
    def get_tags(post_id: int = None):
        tags = []

        try:
            with UtilDatabaseCursor() as cursor:
                if post_id:

                    query = cursor.execute(
                        "SELECT tags.tags_id ,name   FROM tags_posts_connection"
                        " INNER JOIN tags ON  tags_posts_connection.tags_id = tags.tags_id "
                        " WHERE post_id = ?  ",
                        [post_id],
                    )
                else:
                    query = cursor.execute(
                        "SELECT *   FROM tags"

                    )

                if query.rowcount:
                    col_names = [it[0] for it in query.description]
                    for row in query.fetchall():
                        tag = ModelTag()
                        for key, value in zip(col_names, row):
                            if key == "tags_id":
                                tag.tags_id = value
                            elif key == "name":
                                tag.name = value

                        tags.append(tag)




        except Exception as exc:
            print(exc)
        return tags

    @staticmethod
    def create_link_posts_Tags(post_id, tags_id):
        isSuccess = False
        try:
            if post_id:
                with ControllerDatabase.__connection() as conn:
                    cursor = conn.cursor()
                    cursor.execute(
                        "SELECT * FROM tags_posts_connection WHERE post_id = ? AND tags_id = ?",
                        [post_id, tags_id]
                    )
                    existing_link = cursor.fetchone()

                    if existing_link:
                        print("Link already exists")
                    else:
                        cursor.execute(
                            "INSERT INTO tags_posts_connection (post_id, tags_id)  VALUES (?, ?) ",
                            [post_id, tags_id]
                        )

        except Exception as exc:
            print(exc)
        return isSuccess
