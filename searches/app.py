import flask

search = flask.Blueprint(
    name = "search",
    import_name = "searches",
    static_folder = "static",
    template_folder = "templates",
    static_url_path = "/search/static"
)