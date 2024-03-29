import flask

from configs import Configs
from controllers.ControllerDatabase import ControllerDatabase
from controllers.ControllerPosts import ControllerPosts

app = flask.Flask(__name__, template_folder='views')
app.register_blueprint(ControllerPosts.blueprint)
app.config.from_object(Configs)


@app.route("/", methods=['GET'])
def home():
    params_GET = flask.request.args
    message = ""
    posts = ControllerDatabase.get_all_posts_flattened()
    if params_GET.get("deleted"):
        message = "deleted"
    if params_GET.get("edited"):
        message = "edited"

    return flask.render_template(
        'home_div.html',
        message=message,
        posts=posts
    )


app.run(
    host='localhost',  # localhost == 127.0.0.1
    port=8000,  # by default HTTP 80, HTTPS 443 // 8000, 8080
    debug=True
)
