import flask

finish_test = flask.Blueprint(
    name = "finish_test",
    import_name = "pass_quiz",
    template_folder = "template",
    static_folder = "static",
    static_url_path = "/finish_test/static"
)