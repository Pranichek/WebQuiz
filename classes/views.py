import flask, flask_login
from .models import Classes
from Project.db import DATABASE
from flask_socketio import emit
from home.models import User
from Project.login_check import login_decorate
from Project.socket_config import socket

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

@login_decorate
def render_mentor_classes():
    all_classes = flask_login.current_user.mentor_class.all()

    return flask.render_template(
        "mentor_classes.html",
        all_classes = all_classes,
        email = flask_login.current_user.email,
        name_avatar = flask_login.current_user.name_avatar,
        test_data = True
    )

@login_decorate
def render_data_class():
    class_id = flask.request.args.get("class_id")
    class_item = Classes.query.get(class_id)
    users_list = []

    if class_item.students is not None:
        users = class_item.students.split("/")
        try:
            users.remove("")
        except:
            pass

        
        for user in users:
            users_list.append(User.query.get(int(user)))

    data_topic = class_item.theme_task.split("/")
    data_info = class_item.information_task.split("/")
    ready_anoun = []

    if data_topic[0] == "":
        data_topic.remove("")
    if data_info[0] == "":
        data_info.remove("")

    for elem in range(len(data_topic)):
        ready_anoun.append([data_topic[elem], data_info[elem]])

    return flask.render_template(
        'class_data.html',
        users_list = users_list,
        test_data = True,
        ready_anoun = ready_anoun
    )

@socket.on("create_task")
def create_task(data):
    class_id = int(data["class_id"])
    class_item = Classes.query.get(class_id)

    topic = data["theme"]
    task_info = data["information"]

    
    old_topics = class_item.theme_task.split("/")
    old_information = class_item.information_task.split("/")

    old_topics.append(topic)
    old_information.append(task_info)  
    
    class_item.theme_task = "/".join(old_topics)
    class_item.information_task = "/".join(old_information)
    DATABASE.session.commit()


@login_decorate
def render_student_classes():
    if flask.request.method == "POST":
        code = flask.request.form.get("code")

        check_class = Classes.query.filter_by(code = code).first()
        
        if check_class:
            user_id = str(flask_login.current_user.id)
            users_classes = check_class.students.split("/") 
            if user_id not in users_classes:
                users_classes.append(user_id)
                new_user = "/".join(users_classes)
                
                check_class.students = new_user
                DATABASE.session.commit()
                

            


    return flask.render_template("student_classes.html", test_data = True)
    return flask.render_template("student_classes.html")

def render_delete_member(pk):
    class_id = flask.request.args.get("class_id")
    class_item = Classes.query.get(class_id)
    users = class_item.students.split("/")
    users.remove(str(pk))
    new_users = "/".join(users)
    class_item.students = new_users
    DATABASE.session.commit()