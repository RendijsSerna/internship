from idlelib import query
from sqlite3 import Cursor
from typing import Union

from flask import session

from models.ModelPost import ModelPost
import sqlite3


class ControllerDatabase:

    @staticmethod
    def __connection():
        return sqlite3.connect("./blog.sqlite ")

    @staticmethod
    def insert_post(post: ModelPost) -> Union[Cursor, str]:
        url_slug = post.url_slug
        try:
            with ControllerDatabase.__connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO posts (body, title, url_slug)"
                    "VALUES (:body, :title, :url_slug)",
                    post.__dict__
                )

                cursor.close()
        except Exception as exc:
            print(exc)
        return url_slug

    @staticmethod
    def get_post(url_slug: str) -> ModelPost:
        post = None
        try:
            with ControllerDatabase.__connection() as conn:
                cursor = conn.cursor()
                query = cursor.execute(
                    "SELECT * FROM posts WHERE url_slug = :url_slug LIMIT 1",
                    {'url_slug': url_slug}
                )

                if query.rowcount:
                    col = query.fetchone()
                    col_names = [it[0] for it in query.description]
                    post = ModelPost()
                    if "post_id" in col_names:
                        post.post_id = col[col_names.index("post_id")]
                    if "title" in col_names:
                        post.title = col[col_names.index("title")]
                    if "body" in col_names:
                        post.body = col[col_names.index("body")]

            cursor.close()
        except Exception as exc:
            print(exc)
        return post

    @staticmethod
    def delete_post(post_id: int):
        result = 'post is deleted: failed'
        try:

            with ControllerDatabase.__connection() as conn:
                cursor = conn.cursor()

                cursor.execute(
                    "DELETE FROM posts WHERE post_id = :post_id",
                    {'post_id': post_id}
                )
                conn.commit()
                cursor.close()

            if int(post_id) != 0:
                result = 'post is deleted: success'

        except Exception as exc:
            print(f"An error occurred: {exc}")

        return result
