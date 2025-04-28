import flask
from .models import User
from Project.db import DATABASE

def render_home():
    return flask.render_template(template_name_or_list = "home.html")

def render_registration():
    message = ''
    if flask.request.method == "POST":
        user = User(
            name = flask.request.form["name"],
            password = flask.request.form["password"],
            email = flask.request.form["email"],
            phone_number = flask.request.form["phone_number"],
            surname = flask.request.form["surname"]
        )

        DATABASE.session.add(user)
        DATABASE.session.commit()

        message = "User registered successfully"
        

    return flask.render_template(template_name_or_list = "registration.html", message = message)

def render_login():
    return flask.render_template(template_name_or_list = "login.html")