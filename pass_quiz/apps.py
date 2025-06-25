import flask

finish_test = flask.Blueprint(
    name = "finish_test",
    import_name = "pass_quiz",
    template_folder = "template",
    static_folder = "static",
    static_url_path = "/finish_test/static"
)

passing_mentor = flask.Blueprint(
    name = "passing_mentor",
    import_name = "pass_quiz",
    template_folder = "template",
    static_folder = "static",
    static_url_path = "/passing_mentor/static"
)

passing_student = flask.Blueprint(
    name = "passing_student",
    import_name = "pass_quiz",
    template_folder = "template",
    static_folder = "static",
    static_url_path = "/passing_student/static"
)