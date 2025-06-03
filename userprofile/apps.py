import flask


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


