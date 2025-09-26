import flask

finish_test = flask.Blueprint(
    name = "finish_test",
    import_name = "pass_quiz",
    template_folder = "template",
    static_folder = "static",
    static_url_path = "/finish_test/static"
)

solo_pass = flask.Blueprint(
    name = "solo_passing",
    import_name = "pass_quiz",
    template_folder = "template",
    static_folder = "static",
    static_url_path = "/solo_passing/static"
)

questions = flask.Blueprint(
    name = "questions",
    import_name = "questions",
    template_folder = "template",
    static_folder = "static",
    static_url_path = "/questions/static"
)