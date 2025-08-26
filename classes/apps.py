import flask

mentor_class = flask.Blueprint(
    name= "mentor_class",
    import_name= "classes",
    static_folder= "static",
    template_folder= "templates",
    static_url_path= "/static/mentor_classes"
)

student_class = flask.Blueprint(
    name= "student_class",
    import_name= "classes",
    static_folder= "static",
    template_folder= "templates",
    static_url_path= "/static/student_class"
)