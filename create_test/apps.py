import flask

test_editor = flask.Blueprint(
    name="test_editor",
    import_name = "create_test",
    static_url_path="/create_test/static",
    static_folder="static",
    template_folder="templates",
)