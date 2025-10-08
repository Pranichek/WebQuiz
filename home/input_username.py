import flask

def render_input_username():
    if flask.request.method == "POST":
        username = flask.request.form.get("input_name")
        if username:
            return flask.redirect(f"student?room_code={flask.session['room_code']}")

    return flask.render_template(
        "input_username.html",
        registration_page = True
    )
