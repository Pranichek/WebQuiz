import flask, flask_login
from .models import Classes
from Project.db import DATABASE
from flask_socketio import emit
from home.models import User

def render_create_class():
    if flask.request.method == "POST":
        class_name = flask.request.form.get("class_name")
        description = flask.request.form.get("description")
        form = flask.request.form.get("form")
        letter = flask.request.form.get("letter")
        lesson = flask.request.form.get("lesson")
        type = flask.request.form.get("type")

        class_mentor = Classes(
            name_class = class_name,
            description = description,
            form = form,
            letter = letter,
            lesson = lesson,
            user_id = flask_login.current_user.id,
        )
        DATABASE.session.add(class_mentor)
        DATABASE.session.commit()

        return flask.redirect("/mentor_class")
    
    return flask.render_template(
        "create_class.html"
    )

def render_mentor_classes():
    all_classes = flask_login.current_user.mentor_class.all()

    return flask.render_template(
        "mentor_classes.html",
        all_classes = all_classes
    )

def render_student_classes():
    return flask.render_template("student_classes.html")



