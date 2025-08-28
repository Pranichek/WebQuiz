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
            code = flask.request.form.get("code")
        )
        DATABASE.session.add(class_mentor)
        DATABASE.session.commit()

        return flask.redirect("/mentor_class")
    
    return flask.render_template(
        "create_class.html"
    )

def render_mentor_classes():
    all_classes = flask_login.current_user.mentor_class.all()
    name = flask_login.current_user.username
    email = flask_login.current_user.email
    size_avatar = flask_login.current_user.size_avatar
    name_avatar = flask_login.current_user.name_avatar

    return flask.render_template(
        "mentor_classes.html",
        all_classes = all_classes,
        name = name,
        email = email,
        size_avatar = size_avatar,
        name_avatar = name_avatar
    )

def render_data_class():
    class_id = flask.request.args.get("class_id")
    class_item = Classes.query.get(class_id)
    users = class_item.students.split("/")
    users.remove("")

    users_list = []
    for user in users:
        users_list.append(User.query.get(int(user)))

    return flask.render_template(
        'class_data.html',
        users_list = users_list
    )

def render_student_classes():
    if flask.request.method == "POST":
        code = flask.request.form.get("code")

        check_class = Classes.query.filter_by(code = code).first()
        
        if check_class:
            user_id = str(flask_login.current_user.id)
            users_classes = check_class.students.split("/") 
            print(users_classes, 'lol')
            if user_id not in users_classes:
                users_classes.append(user_id)
                new_user = "/".join(users_classes)
                
                check_class.students = new_user
                DATABASE.session.commit()
                

            


    return flask.render_template("student_classes.html")



