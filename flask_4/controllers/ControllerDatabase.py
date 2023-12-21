from sqlite3 import Cursor
from typing import List

from models.ModelPost import ModelPost
import sqlite3

from utils.UtilDatabaseCursor import UtilDatabaseCursor


class ControllerDatabase:

    @staticmethod
    def insert_post(post: ModelPost) -> int:
        post_id = 0
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "INSERT INTO posts (title, body, url_slug) "
                    "VALUES (:title, :body, :url_slug);",
                    post.__dict__
                )
                post_id = cursor.execute("SELECT last_insert_rowid()").fetchone()[0]
        except Exception as exc:
            print(exc)
        return post_id

    @staticmethod
    def update_post(post: ModelPost):
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute("UPDATE posts SET (title, body, url_slug) ="
                               " (:title, :body, :url_slug) WHERE post_id = :post_id",
                               post.__dict__

                               )
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
                    col = query.fetchone()
                    post = ModelPost()
                    (
                        post.post_id,
                        post.title,
                        post.body,
                        post.created,
                        post.modified,
                        post.url_slug,
                        post.thumbnail_uuid,
                        post.status
                    ) = col

        except Exception as exc:
            print(exc)
        return post

    @staticmethod
    def delete_post(post_id: int) -> None:
        try:
            with UtilDatabaseCursor() as cursor:
                cursor.execute(
                    "DELETE FROM posts WHERE post_id = ?",
                    [post_id]
                )
        except Exception as exc:
            print(exc)

    @staticmethod
    def get_all_posts() -> list[ModelPost]:
        posts = []
        try:
            with UtilDatabaseCursor() as cursor:
                query = cursor.execute(
                    "SELECT * FROM posts "

                )

                if query.rowcount:
                    col_names = [it[0] for it in query.description]
                    for row in query.fetchall():
                        post = ModelPost()
                        for key, value in zip(col_names, row):
                            if key == "post_id":
                                post.post_id = value
                            elif key == "title":
                                post.title = value
                            elif key == "modified":
                                post.modified = value
                        posts.append(post)

        except Exception as exc:
            print(exc)
        return posts
