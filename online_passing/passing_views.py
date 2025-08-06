import flask, flask_login
from Project.login_check import login_decorate
from flask_socketio import join_room

@login_decorate
def render_mentor_passing():
    return flask.render_template(
        "settings_mentor.html",
        test_page = True
    )

@login_decorate
def render_student_passing():
    return flask.render_template(
        "student_passing.html",
        user = flask_login.current_user,
        bonus_value = flask_login.current_user.user_profile.percent_bonus if flask_login.current_user.is_authenticated else "0",
        test_page = True
    )

# страница ожидания для студента
@login_decorate
def render_wait_student():
    return flask.render_template(
        'waiting_room.html',
        user = flask_login.current_user
    )

# страница результатов студента
@login_decorate
def render_result_student():
    return flask.render_template(
        'result_student.html',
        user = flask_login.current_user
    )

# страница результатов ментора
@login_decorate
def render_result_mentor():
    return flask.render_template(
        'result_mentor.html',
        user = flask_login.current_user
    )