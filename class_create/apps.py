import flask

class_create = flask.Blueprint(
    name = "class_create",
    import_name = "class_create",
    static_folder = "static",
    template_folder = "templates",
    static_url_path = "/class/static"
)