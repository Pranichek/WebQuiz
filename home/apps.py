import flask

home_app = flask.Blueprint(
    name = "home",
    import_name = "home",
    static_folder = "static",
    template_folder = "templates",
    static_url_path = "/home/static"
)

registration = flask.Blueprint(
    name = "registration",
    import_name = "home",
    static_folder = "static",
    template_folder = "templates",
    static_url_path = "/registration/static"
)

login = flask.Blueprint(
    name = "login",
    import_name = "home",
    static_folder = "static",
    template_folder = "templates",
    static_url_path = "/login/static"
)
