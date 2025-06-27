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

mentor = flask.Blueprint(
    name="mentor",
    import_name = "quiz",
    static_url_path="/mentor/static",
    static_folder="static",
    template_folder="templates",
)

student = flask.Blueprint(
    name="student",
    import_name = "quiz",
    static_url_path="/student/static",
    static_folder="static",
    template_folder="templates",
)