import flask
from flask import request, redirect, url_for, session

from controllers.ControllerDatabase import ControllerDatabase
from models.ModelPost import ModelPost
import re


class ControllerPosts:
    blueprint = flask.Blueprint("posts", __name__, url_prefix="/posts")

    @staticmethod
    @blueprint.route("/new", methods=["POST", "GET"])
    def post_new():
        if request.method == "POST":
            post = ModelPost()
            post.title = request.form.get('post_title').strip()
            post.body = request.form.get('post_body').strip()
            temp = request.form.get('url_slug')
            post.url_slug = ControllerPosts.slugify(temp)

            url_slug = ControllerDatabase.insert_post(post)
            return redirect(url_for('posts.post_view', url_slug=url_slug))

        return flask.render_template(
            'posts/new.html'
        )

    @staticmethod
    @blueprint.route("/view/<url_slug>", methods=["GET"])
    def post_view(url_slug):
        post = ControllerDatabase.get_post(url_slug)

        return flask.render_template(
            'posts/view.html',
            post=post
        )

    @staticmethod
    @blueprint.route("/delete/<post_id>", methods=["POST"])
    def delete_post(post_id):

        didPostDelete = ControllerDatabase.delete_post(post_id)

        return didPostDelete

    def slugify(s):
        s = s.lower().strip()
        # replaces special chars with ''
        s = re.sub(r'[^\w\s-]', '', s)
        # replaces spaces with  one -
        s = re.sub(r'[\s_-]+', '-', s)
        # replaces any - at the front or end of string
        s = re.sub(r'^-+|-+$', '', s)
        return s
