import flask, flask_login, os, secrets, datetime, pytz
from .models import Classes
from Project.db import DATABASE
from flask_socketio import emit
from home.models import User
from Project.login_check import login_decorate
from Project.socket_config import socket
from datetime import timedelta
from os.path import abspath, join, exists
from Project.settings import project
from flask import request, jsonify


@project.route('/delete_class', methods = ['POST'])
def delete_class():
    data = request.json
    code_class = data["code_class"]
    mentor_class = Classes.query.filter_by(code=code_class).first()
    
    if mentor_class:
        DATABASE.session.delete(mentor_class)
        DATABASE.session.commit()

    return jsonify({'redirect_url': '/menu_classes'})

def classes_information():
    if flask.request.method == "POST":
        check = flask.request.form.get("check_form")
        
        if check == "join":
            code_class = flask.request.form.get("class_code")
            mentor_class = Classes.query.filter_by(code=code_class).first()
            
            if mentor_class:
                if flask_login.current_user not in mentor_class.students:
                    mentor_class.students.append(flask_login.current_user)
        else:
            code_class = flask.request.form.get("btn-leave")
            mentor_class = Classes.query.filter_by(code=code_class).first()
            
            if mentor_class:
                if flask_login.current_user in mentor_class.students:
                    mentor_class.students.remove(flask_login.current_user)

        DATABASE.session.commit()
        

    return flask.render_template(
        "menu_classes.html", 
        user = flask_login.current_user,
        mentor_classes = flask_login.current_user.classes if flask_login.current_user.is_mentor else flask_login.current_user.joined_classes
    )

def render_create_class():        
    return flask.render_template("create_class.html")



@project.route('/create_class', methods=['POST'])
def create_classs():
    data = request.json

    if not flask_login.current_user.is_authenticated:
        return flask.redirect("/login") 
    
    while True:
        random_choice = secrets.token_hex(10)
        check_class = Classes.query.filter_by(code = random_choice).first()
        if not check_class:
            break
        

    class_mentor = Classes(
        name_class = data["class_name"],
        description = data["description"],
        form = data["grade_number"],
        letter = data["grade_letter"],
        lesson = data["subject"],
        code = random_choice,
        type = data["join_type"],
        mentor = flask_login.current_user 
    )
    
    DATABASE.session.add(class_mentor)
    DATABASE.session.commit()

    return jsonify({'redirect_url': '/menu_classes'})


@login_decorate
def render_data_class():
    class_id = flask.request.args.get("class_id")
    class_item = Classes.query.get(class_id)
    code_class = class_item.code
    
    if flask.request.method == "POST":
        topic = flask.request.form.get('topic')
        task_info = flask.request.form.get('task_info')

        
        old_topics = class_item.theme_task.split("/")
        old_information = class_item.information_task.split("/")

        old_topics.append(topic)
        old_information.append(task_info)  
        
        class_item.theme_task = "/".join(old_topics)
        class_item.information_task = "/".join(old_information)
        # ------------- get time

        data_weeks = flask.request.form.get('term-week')
        data_days = flask.request.form.get('term-days')
        data_hours = flask.request.form.get('term-hours')
        data_minutes = flask.request.form.get('term-minutes')

        

        weeks = float(data_weeks) if data_weeks.isdigit() else 0 
        days = float(data_days) if data_days.isdigit() else 0
        hours = float(data_hours) if data_hours.isdigit() else 0
        minutes = float(data_minutes) if data_minutes.isdigit() else 0

        time_zone = pytz.timezone("Europe/Kiev")
        ukraine_time = datetime.datetime.now(time_zone)
        ukraine_time = ukraine_time.strftime("%Y-%m-%d %H:%M:%S").split()

        data_year = ukraine_time[0].split("-")
        data_time = ukraine_time[1].split(":")

        data_year = "/".join(data_year)
        data_time = "/".join(data_time)


        final_time_data = data_year + "/" + data_time

        # Проверяем, есть ли файл в запросе
        if 'input-file' in flask.request.files:
            file = flask.request.files['input-file'] # Получаем файл по имени поля
            if file.filename != '':
                need_dir = final_time_data.replace("/", ".")
                # Сохраняем файл на сервере

                filename = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email) , "classes"))
                if not exists(filename):
                    os.mkdir(filename)

                final_directory = join(filename, need_dir)
                if not exists(final_directory):
                    os.mkdir(final_directory)  

                file_dir = join(final_directory, file.filename)

                file.save(file_dir)

        term_time = datetime.datetime.now(time_zone) + timedelta(weeks=weeks, days=days, hours=hours, minutes=minutes)
        term_time = str(term_time).split() # "2025-09-01 14:08:19.530785+03:00"

        data_year = term_time[0].split("-")
        data_time = term_time[1].split(".")[0].split(":")

        data_year = "/".join(data_year)
        data_time = "/".join(data_time)

        final_term = data_year + "/" + data_time # 2025/09/01/14/10/37


        old_time = class_item.start_time.split("@")
        old_terms = class_item.term_task.split("@")

        old_time.append(final_time_data)
        old_terms.append(final_term)  
        
        class_item.start_time = "@".join(old_time)
        class_item.term_task = "@".join(old_terms)
        
        DATABASE.session.commit()

        return flask.jsonify({
            "status": "ok",
            "topic": topic,
            "task_info": task_info
        })

    class_id = flask.request.args.get("class_id")
    class_item = Classes.query.get(class_id)
    users_list = []

    if class_item.students is not None:
        users = class_item.students.split("/")
        users.remove("")

        
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
        ready_anoun = ready_anoun,
        user = flask_login.current_user
    )

# @socket.on("create_task")
# def create_task(data):
#     class_id = int(data["class_id"])
#     class_item = Classes.query.get(class_id)

#     topic = data["theme"]
#     task_info = data["information"]

    
#     old_topics = class_item.theme_task.split("/")
#     old_information = class_item.information_task.split("/")

#     old_topics.append(topic)
#     old_information.append(task_info)  
    
#     class_item.theme_task = "/".join(old_topics)
#     class_item.information_task = "/".join(old_information)
#     # ------------- get time

#     weeks = float(data["weeks"]) if data["weeks"].isdigit() else 0 
#     days = float(data["days"]) if data["days"].isdigit() else 0
#     hours = float(data["hours"]) if data["hours"].isdigit() else 0
#     minutes = float(data["minutes"]) if data["minutes"].isdigit() else 0

#     time_zone = pytz.timezone("Europe/Kiev")
#     ukraine_time = datetime.datetime.now(time_zone)
#     ukraine_time = ukraine_time.strftime("%Y-%m-%d %H:%M:%S").split()

#     data_year = ukraine_time[0].split("-")
#     data_time = ukraine_time[1].split(":")

#     data_year = "/".join(data_year)
#     data_time = "/".join(data_time)


#     final_time_data = data_year + "/" + data_time

#     term_time = datetime.datetime.now(time_zone) + timedelta(weeks=weeks, days=days, hours=hours, minutes=minutes)
#     term_time = str(term_time).split() # "2025-09-01 14:08:19.530785+03:00"

#     data_year = term_time[0].split("-")
#     data_time = term_time[1].split(".")[0].split(":")

#     data_year = "/".join(data_year)
#     data_time = "/".join(data_time)

#     final_term = data_year + "/" + data_time # 2025/09/01/14/10/37


#     old_time = class_item.start_time.split("@")
#     old_terms = class_item.term_task.split("@")

#     old_time.append(final_time_data)
#     old_terms.append(final_term)  
    
#     class_item.start_time = "@".join(old_time)
#     class_item.term_task = "@".join(old_terms)
    
#     DATABASE.session.commit()


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
            
            return flask.redirect(f"/student_information?code={code}")


    return flask.render_template("student_classes.html", test_data = True, user = flask_login.current_user)



