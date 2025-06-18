import flask
from flask_socketio import SocketIO

profile = flask.Blueprint(
    name="profile",
    import_name="userprofile",
    static_folder="static",
    template_folder="templates",
    static_url_path="/profile/static",
)

edit_avatar = flask.Blueprint(
    name="edit_avatar",
    import_name = "userprofile",
    static_url_path="/edit_avatar/static",
    static_folder="static",
    template_folder="templates",
)

change_tests = flask.Blueprint(
    name="change_tests",
    import_name = "userprofile",
    static_url_path="/change_tests/static",
    static_folder="static",
    template_folder="templates",
)

mentor = flask.Blueprint(
    name="mentor",
    import_name = "userprofile",
    static_url_path="/mentor/static",
    static_folder="static",
    template_folder="templates",
)

student = flask.Blueprint(
    name="student",
    import_name = "userprofile",
    static_url_path="/student/static",
    static_folder="static",
    template_folder="templates",
)

buy_gifts = flask.Blueprint(
    name="buy_gifts",
    import_name="userprofile",
    static_folder="static",
    template_folder="templates",
    static_url_path="/buy_gifts/static",
)