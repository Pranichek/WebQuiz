import flask, flask_login
from .models import Classes
from Project.db import DATABASE
from flask_socketio import emit

def render_create_class():
    if flask.request.method == "POST":
        class_name = flask.request.form.get("class_name")
        description = flask.request.form.get("description")

        class_mentor = Classes(
            name_class = class_name,
            description = description,
            user_id = flask_login.current_user.id,
        )
        DATABASE.session.add(class_mentor)
        DATABASE.session.commit()

        return flask.redirect("/mentor_class")

    return flask.render_template("create_class.html")

def render_mentor_classes():
    return flask.render_template("mentor_classes.html")

def render_student_classes():
    return flask.render_template("student_classes.html")



