import functools
import os.path

import flask
from flask import request, redirect, url_for

from controllers.ControllerDatabase import ControllerDatabase

from models.ModelPost import ModelPost
from models.ModelTag import ModelTag
from utils.UtilStrings import UtilStrings


class ControllerPosts:
    blueprint = flask.Blueprint("posts", __name__, url_prefix="/posts")

    @staticmethod
    @blueprint.route("/new", methods=["POST", "GET"])
    @blueprint.route("/edit/<post_id>", methods=["POST", "GET"])
    def post_edit(post_id=None):


        redirect_url = None
        post = ModelPost
        tags = ControllerDatabase.get_tags()
        tags_with_connection = ControllerDatabase.tags_with_connection(post_id)

        if post_id is not None:
            post = ControllerDatabase.get_post(post_id)

        post_flattened = ControllerDatabase.get_all_posts_flattened(parent_post_id=None)
        post_parent_id_and_title = [
            (None, "No parent")
        ]

        if request.method == "POST":
            button_type = request.form.get("button_type")
            if button_type == "delete":
                ControllerDatabase.delete_post(post_id)
                redirect_url = '/?deleted=1'

            post.title = request.form.get('post_title')
            if post.title:
                post.title = post.title.strip()
            else:
                raise ValueError("Postam ir nepieciesams title")

            post.body = request.form.get('post_body')
            if post.body:
                post.body = post.body.strip()
            else:
                raise ValueError("Postam ir nepieciesams body")

            post.url_slug = request.form.get('url_slug')
            if post.url_slug:
                post.url_slug = post.url_slug.strip()
            else:
                raise ValueError("Postam ir nepieciesams url_slug")

            file = request.files['image']
            if file:
                post.thumbnail_uuid = UtilStrings.generate_random_uuid()
                test = f"uploads/images/{post.thumbnail_uuid}.png"
                file.save(test)

            if post.post_id > 0:
                ControllerDatabase.update_post(post)
                redirect_url = f"/?edited={post.url_slug}"
            else:
                post.post_id = ControllerDatabase.insert_post(post)

            selected_tags = request.form.getlist('selected_tags')

            if selected_tags:
                tags = ControllerDatabase.tags_with_connection(post.post_id)

                for tag in tags:
                    ControllerDatabase.delete_post_tags_connection(post.post_id, tag)

                for tag_id in selected_tags:
                    ControllerDatabase.create_link_posts_tags(post.post_id, tag_id)

            else:
                tags = ControllerDatabase.tags_with_connection(post.post_id)

                for tag in tags:
                    ControllerDatabase.delete_post_tags_connection(post.post_id, tag)

        if redirect_url:
            result = redirect(redirect_url)
        else:
            result = flask.render_template(
                'posts/edit.html',
                post=post,
                tags=tags,
                tags_with_connection=tags_with_connection
                #      post_parent_id_by_title=post_parent_id_by_title

            )
        return result

    @staticmethod
    @blueprint.route("/view/<url_slug>", methods=["GET"])
    def post_view(url_slug):
        post = ControllerDatabase.get_post(url_slug=url_slug)
        tags = ControllerDatabase.get_tags(post.post_id)
        return flask.render_template(
            'posts/view.html',
            post=post,
            tags=tags
        )
