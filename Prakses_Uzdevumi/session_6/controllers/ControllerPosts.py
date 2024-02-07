import functools
import os.path

import flask
from flask import request, redirect, url_for, flash

from controllers.ControllerDatabase import ControllerDatabase

from models.ModelPost import ModelPost
from models.ModelTag import ModelTag
from utils.UtilStrings import UtilStrings


class ControllerPosts:
    blueprint = flask.Blueprint("posts", __name__, url_prefix="/posts")

    @staticmethod
    @blueprint.route("/new", methods=["POST", "GET"])
    @blueprint.route("/edit/<post_id>", methods=["POST", "GET"])
    def post_edit(post_id=0):

        redirect_url = None
        post = ModelPost()
        tags = ControllerDatabase.get_tags()
        tags_with_connection = ControllerDatabase.tags_with_connection(post_id)
        fail_message = ""

        if post_id is not None:
            post = ControllerDatabase.get_post(post_id)

        post_flattened = ControllerDatabase.get_all_posts_flattened(exclude_branch_post_id=post_id)
        post_parent_id_and_title = [
            (None, "No parent")
        ]
        for post_current in post_flattened:
            prefix = ''
            if post_current.depth > -1:
                prefix = ''.join(['-'] * post_current.depth) + ' '
                post_parent_id_and_title.append(
                    (post_current.post_id,
                     f'{prefix}{post_current.title}')
                )

        if request.method == "POST":
            button_type = request.form.get("button_type")
            if button_type == "delete":
                ControllerDatabase.delete_post(post_id)
                redirect_url = '/?deleted=1'
            else:

                post.title = request.form.get('post_title')
                if post.title:
                    post.title = post.title.strip()
                else:
                    fail_message += "Missing post title. "

                post.body = request.form.get('post_body')
                if post.body:
                    post.body = post.body.strip()
                else:
                    fail_message += "Missing post body. "

                post.url_slug = request.form.get('url_slug')
                if post.url_slug:
                    post.url_slug = post.url_slug.strip()
                else:
                    fail_message += "Missing post URL slug. "

                try:
                    post.parent_post_id = int(request.form.get('parent_post_id'))
                except:
                    post.parent_post_id = None

                file = request.files['image']
                if file:
                    post.thumbnail_uuid = UtilStrings.generate_random_uuid()
                    test = f"uploads/images/{post.thumbnail_uuid}.png"
                    file.save(test)

                if fail_message:
                    pass
                else:
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
                tags_with_connection=tags_with_connection,
                post_parent_id_and_title=post_parent_id_and_title,
                fail_message=fail_message

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
