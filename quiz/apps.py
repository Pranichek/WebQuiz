import flask

test_pass = flask.Blueprint(
    name = "test_pass",
    import_name = "quiz",
    static_folder = "static",
    template_folder = "templates",
    static_url_path = "/test_pass/static"
)

change_tests = flask.Blueprint(
    name="change_tests",
    import_name = "quiz",
    static_url_path="/change_tests/static",
    static_folder="static",
    template_folder="templates",
)

