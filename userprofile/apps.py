import flask


profile = flask.Blueprint(
    name="profile",
    import_name="userprofile",
    static_folder="static",
    template_folder="templates",
    static_url_path="/profile/static"
)