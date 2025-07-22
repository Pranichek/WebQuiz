import flask

choose_graphics = flask.Blueprint(
    name = "choose_graphics",
    import_name = "graphics",
    static_folder = "static",
    template_folder = "templates",
    static_url_path = "/user_graphics/static"
)

user_graphics = flask.Blueprint(
    name="user_graphics",
    import_name="graphics",
    static_folder="static",
    template_folder="templates",
    static_url_path="/user_graphics/static"
)