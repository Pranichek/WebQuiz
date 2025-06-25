import flask

def render_mentor_passing():
    return flask.render_template(
        "settings_mentor.html",
        test_page = True
    )