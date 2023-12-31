import flask
from flask import url_for

from controllers.ControllerDatabase import ControllerDatabase
from controllers.ControllerPosts import ControllerPosts

app = flask.Flask(__name__, template_folder='views')
app.register_blueprint(ControllerPosts.blueprint)



@app.route("/", methods=['GET'])
def home():

    params_GET = flask.request.args
    message = 0
    posts = ControllerDatabase.get_all_posts()
    if params_GET.get("deleted"):
        message = 1
    if params_GET.get("edited"):
        message = 2

    test = ControllerDatabase.get_tags()
    print(test)
    test2 = ControllerDatabase.get_tags(1)
    print(test2)



    return flask.render_template(
        'home_div.html',
        message=message,
        posts=posts
    )

app.run(
    host='localhost', # localhost == 127.0.0.1
    port=8000, # by default HTTP 80, HTTPS 443 // 8000, 8080
    debug=True
)
