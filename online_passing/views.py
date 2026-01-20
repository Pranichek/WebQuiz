import flask, flask_login, qrcode, os
from Project.login_check import login_decorate
from os.path import exists, abspath, join
from Project.socket_config import socket
from flask_login import current_user
from online_passing.del_files import delete_files_in_folder
from Project.db import DATABASE
from quiz.models import Test


@login_decorate
def render_mentor():
    id_test = flask.request.args.get("id_test")
    # отримуємо код кімнати з параметрів запиту
    test : Test = Test.query.get(id_test)

    # зберігаємо об'єкт користувача в змінну
    if flask.request.method == "POST":
        socket.emit()


    return flask.render_template(
        "mentor.html",
        home = True,
        user = current_user,
        title_test = test.title_test,
        test=test
    )


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
        user = flask_login.current_user if flask_login.current_user.is_authenticated else None,
        count_money = current_user.user_profile.count_money,
    )