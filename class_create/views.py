import flask
def render_class():
    return flask.render_template(
        template_name_or_list = "create_class.html", 
    )
    