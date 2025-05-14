import flask

test_pass = flask.Blueprint(
    name = "test_pass",
    import_name = "quiz",
    static_folder = "static",
    template_folder = "templates",
    static_url_path = "/test_pass/static"
)