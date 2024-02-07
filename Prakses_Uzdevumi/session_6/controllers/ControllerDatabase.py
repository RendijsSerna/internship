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
                    "INSERT INTO posts (title, body, url_slug, parent_post_id, thumbnail_uuid) "
                    "VALUES (:title, :body, :url_slug, :parent_post_id, :thumbnail_uuid);",
                    post.__dict__
                )
                post_id, = cursor.execute("SELECT last_insert_rowid()").fetchone()
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
                    "UPDATE posts SET (title, body, url_slug, parent_post_id, thumbnail_uuid) = "
                    "(:title, :body, :url_slug, :parent_post_id, :thumbnail_uuid)"
                    " WHERE post_id = :post_id",
                    post.__dict__

                )
                cursor.close()

        except Exception as exc:
            print(exc)

    @staticmethod
    def get_post(post_id: int = None, url_slug: str = None) -> ModelPost:
        post = None
        try:
            with UtilDatabaseCursor() as cursor:
                if post_id:
                    query = cursor.execute(
                        "SELECT * FROM posts WHERE post_id = :post_id LIMIT 1;",
                        {'post_id': post_id}
                    )
                else:
                    query = cursor.execute(
                        "SELECT * FROM posts WHERE url_slug = :url_slug LIMIT 1;",
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
                        post.is_deleted
                    ) = col

                    post.children_posts = ControllerDatabase.get_all_posts(parent_post_id=post.post_id)

        except Exception as exc:
            print(exc)
        return post

    @staticmethod
    def delete_post(post_id: int) -> bool:
        is_success = False
        try:
            with ControllerDatabase.__connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "UPDATE posts SET  (is_deleted) =   (TRUE) WHERE post_id = :post_id  ;",
                    [post_id]
                )
                is_success = True
        except Exception as exc:
            print(exc)
        return is_success

    @staticmethod
    def get_all_posts(parent_post_id=None):
        posts = []
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    f"SELECT post_id FROM posts WHERE parent_post_id {'=' if parent_post_id else 'IS'} ?",
                    [parent_post_id]
                )
                for post_id, in cursor.fetchall():
                    post = ControllerDatabase.get_post(post_id)
                    posts.append(post)
        except Exception as exc:
            print(exc)
        return posts

    @staticmethod
    def get_all_posts_flattened(parent_post_id=None, exclude_branch_post_id=None):
        posts_flat = []
        try:
            post_hierarchy = ControllerDatabase.get_all_posts(parent_post_id)

            while len(post_hierarchy) > 0:
                post_cur = post_hierarchy.pop(0)

                if post_cur.post_id == exclude_branch_post_id:
                    continue

                if post_cur.parent_post_id is not None:
                    post_cur.depth += 1
                    post_parent = next(
                        iter(it for it in posts_flat if it.post_id == post_cur.parent_post_id))

                    if post_parent:
                        post_cur.depth += post_parent.depth

                post_hierarchy = post_cur.children_posts + post_hierarchy
                posts_flat.append(post_cur)

        except Exception as exc:
            print(exc)
        return posts_flat

    @staticmethod
    def get_tags(post_id: int = None):
        tags = []

        try:
            with UtilDatabaseCursor() as cursor:
                if post_id:
                    query = cursor.execute(
                        "SELECT tags.tags_id ,name   FROM tags_posts_connection"
                        " INNER JOIN tags ON  tags_posts_connection.tags_id = tags.tags_id "
                        " WHERE post_id = ?  AND is_deleted = 0",
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
    def create_link_posts_tags(post_id, tags_id):
        is_success = False
        try:
            if post_id:
                with ControllerDatabase.__connection() as conn:
                    cursor = conn.cursor()
                    cursor.execute(
                        "SELECT COUNT(*) FROM tags_posts_connection WHERE post_id = ? AND tags_id = ?"
                        " LIMIT 1",
                        [post_id, tags_id]
                    )
                    count = cursor.fetchone()[0]

                    if count > 0:
                        # Link already exists. Swapped is_deleted to 0
                        cursor.execute(
                            "UPDATE tags_posts_connection SET is_deleted = 0 WHERE post_id = ? AND tags_id = ?"
                            " AND is_deleted = 1",
                            [post_id, tags_id]
                        )
                        conn.commit()
                    else:
                        # Creates new link
                        cursor.execute(
                            "INSERT INTO tags_posts_connection (post_id, tags_id) VALUES (?, ?)",
                            [post_id, tags_id]
                        )
                        is_success = True

        except Exception as exc:
            print(exc)
        return is_success

    @staticmethod
    def tags_with_connection(post_id):
        tags_with_con = []
        try:
            with ControllerDatabase.__connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT tags_id FROM tags_posts_connection WHERE post_id = ? AND is_deleted = 0  ",
                    [post_id]
                )
                results = cursor.fetchall()
                for result in results:
                    tags_with_con.append(result[0])
        except Exception as exc:
            print(exc)
        return tags_with_con

    @staticmethod
    def delete_post_tags_connection(post_id, tags_id):
        try:
            with ControllerDatabase.__connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "UPDATE tags_posts_connection SET is_deleted = 1 WHERE post_id = ?"
                    " AND tags_id = ? ",
                    [post_id, tags_id]
                )
                conn.commit()
        except Exception as exc:
            print(exc)


