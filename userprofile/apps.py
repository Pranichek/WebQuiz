import flask
from flask_socketio import SocketIO

profile = flask.Blueprint(
    name="profile",
    import_name="userprofile",
    static_folder="static",
    template_folder="templates",
    static_url_path="/profile/static"
)

edit_avatar = flask.Blueprint(
    name="edit_avatar",
    import_name = "userprofile",
    static_url_path="/edit_avatar/static",
    static_folder="static",
    template_folder="templates"
)


buy_gifts = flask.Blueprint(
    name="buy_gifts",
    import_name="userprofile",
    static_folder="static",
    template_folder="templates",
    static_url_path="/buy_gifts/static"
)

test_result_app = flask.Blueprint(
    name="test_result",
    import_name = "userprofile",
    static_folder="static",
    template_folder="templates",
    static_url_path="/test_result/static"
)

user_graphics = flask.Blueprint(
    name="user_graphics",
    import_name="userprofile",
    static_folder="static",
    template_folder="templates",
    static_url_path="/user_graphics/static"
)