import flask, flask_login
from Project.login_check import login_decorate
from Project.socket_config import socket
from flask_login import current_user
from Project.db import DATABASE
from quiz.models import Test
from Project.settings import project
from flask import Flask, render_template, request, jsonify

# just for load images
@project.route("/image_data", methods = ['POST'])
def handle_generate_url():
    if request.method == "POST":
        image_url = flask.url_for('student.static', filename = 'images/click.svg')

        response = {
            "click_img": image_url
        }

        return jsonify(response), 200

# data for mentor_page
@project.route("/mentor_data", methods = ['POST', 'GET'])
def handle_mentor_ajax():
    if request.method == "POST":
        data = request.get_json()

        if data:
            test : Test = Test.query.get(int(data["test_id"]))
            test_time = test.question_time.split("?#?")
            count_sec = 0

            for sec in test_time:
                count_sec += int(sec)

            min = ""
            sec = ""
            print(count_sec , "djd")
            if count_sec > 60:
                min = f"{count_sec // 60} хвилин"
                sec = f" {count_sec - (60 * (count_sec // 60))} секунд" if count_sec % 60 != 0 else ""
            else:
                sec = f"{count_sec} секунд"
            
            chat_robots = flask.url_for('mentor.static', filename='images/chat/chat_robots.svg')
            send_button = flask.url_for('mentor.static', filename='images/chat/send_button.svg')
            chat_robot = flask.url_for('mentor.static', filename='images/chat_robot.png')
            exit_img = flask.url_for('mentor.static', filename='images/mentor/exit.svg')

            response = {
                "title_test": test.title_test,
                "count_question": test.questions.count("?%?") + 1,
                "time": min + sec,
                "exit_img":exit_img
            }

            return jsonify(response), 200

@login_decorate
def render_mentor():
    id_test = flask.request.args.get("id_test")
    # отримуємо код кімнати з параметрів запиту
    test : Test = Test.query.get(id_test)

    # зберігаємо об'єкт користувача в змінну
    if flask.request.method == "POST":
        socket.emit()

    user = flask_login.current_user

    

    return flask.render_template(
        "mentor.html",
        title_test = test.title_test,
        test=test
    )

@project.route("/student_data", methods = ['POST'])
def handle_student_data():
    if request.method == "POST":
        user = flask_login.current_user

        user_id = user.id

        avatar_url = flask.url_for('profile.static', filename=f"images/edit_avatar/{user.name_avatar}")
        copy_img = flask.url_for('mentor.static', filename = 'images/mentor/copy.svg')
        chat_robots = flask.url_for('mentor.static', filename='images/chat/chat_robots.svg')
        send_button = flask.url_for('mentor.static', filename='images/chat/send_button.svg')
        chat_robot = flask.url_for('mentor.static', filename='images/chat_robot.png')
        pet_img = flask.url_for(
                'profile.static',
                filename=f'images/pets_id/{user.user_profile.pet_id}.png'
            )

        response = {
            "user_id": user_id,
            "pet_img": pet_img,
            "avatar_url": avatar_url,
            "username": user.username,
            "email": user.email,
            "copy_img": copy_img,
            "chat_robots": chat_robots,
            "send_button": send_button,
            "chat_robot": chat_robot
        }

        return jsonify(response), 200

@project.route('/passing_data', methods = ['POST'])
def handle_passing():
    if request.method == "POST":
        user = flask_login.current_user
        sad_robot = flask.url_for('test_pass.static', filename='images/sad_robot.svg')
        happy_robot = flask.url_for('test_pass.static', filename='images/happy_robot.svg')
        click_img = flask.url_for('student.static', filename = 'images/click.svg')
        coin = flask.url_for('test_pass.static', filename = 'images/money.svg')
        plus_img = flask.url_for('test_pass.static', filename = 'images/plus.svg')
        correct = flask.url_for('student.static', filename = 'images/student/correct.svg')
        uncorrect = flask.url_for('student.static', filename = 'images/student/uncorrect.svg')
        skip = flask.url_for('student.static', filename = 'images/student/skip.svg')
        accuracy = flask.url_for('student.static', filename = 'images/student/accuracy.svg')
        points = flask.url_for('student.static', filename = 'images/student/points.svg')

        response = {
            "user_id": user.id,
            "sad_robot": sad_robot,
            "happy_robot": happy_robot,
            "click_img": click_img,
            "coin": coin,
            "plus_img": plus_img,
            "correct":correct,
            "uncorrect": uncorrect,
            "skip":skip,
            "accuracy": accuracy,
            "points": points
        }

        return jsonify(response), 200

# @login_decorate
def render_student():
    if flask_login.current_user.is_authenticated and str(flask_login.current_user.password) != "1":

        current_user.user_profile.count_points = 0
        # flask_login.current_user.user_profile.last_answered = ""
        DATABASE.session.commit()
    if flask_login.current_user.is_authenticated and flask_login.current_user.user_profile.last_answered in ["" , " ", None]:
        flask_login.current_user.user_profile.last_answered = "пропустив𒀱0.0𒀱2𒀱∅"
        DATABASE.session.commit()

    return flask.render_template(
        "student.html",
    )