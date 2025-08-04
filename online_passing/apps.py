import flask

mentor = flask.Blueprint(
    name="mentor",
    import_name = "online_passing",
    static_url_path="/mentor/static",
    static_folder="static",
    template_folder="templates",
)

student = flask.Blueprint(
    name="student",
    import_name = "online_passing",
    static_url_path="/student/static",
    static_folder="static",
    template_folder="templates",
)