import flask, flask_login
from Project.login_check import login_decorate
from Project.check_room import check_room
from flask_socketio import join_room


@login_decorate
def render_mentor_passing():
    return flask.render_template(
        "settings_mentor.html",
        test_page = True,
        create_question = True
    )

@login_decorate
def render_student_passing():

    return flask.render_template(
        "student_passing.html",
        user = flask_login.current_user,
        bonus_value = flask_login.current_user.user_profile.percent_bonus if flask_login.current_user.is_authenticated else "0",
        test_page = True,
        create_question = True
    )

# страница ожидания для студента
@login_decorate
def render_wait_student():
    return flask.render_template(
        'waiting_room.html',
        user = flask_login.current_user,
        test_page = True,
        create_question = True
    )

# страница результатов студента
@login_decorate
def render_result_student():
    return flask.render_template(
        'result_student.html',
        user = flask_login.current_user,
        test_page = True,
        create_question = True
    )

# страница результатов ментора
@login_decorate
def render_result_mentor():
    return flask.render_template(
        'result_mentor.html',
        user = flask_login.current_user,
        test_page = True,
        create_question = True
    )

# страница финиша ментора
@login_decorate
def render_finish_mentor():
    return flask.render_template(
        'finish_mentor.html',
        user = flask_login.current_user,
        # create_question = True
    )

# страница финиша студента
@check_room
@login_decorate
def render_finish_student():
    return flask.render_template(
        'finish_student.html',
        user = flask_login.current_user,
        test_page = True,
        progress = find_percentage([10, 10, 10, 10, 18, 2, 20, 0, 10, 10]),
    )

def find_percentage(data: list) -> list:
    percentage = []
    for i in range(data.__len__()):
        one = []
        prev_sum = 0
        for prev_i in range(data.__len__()):
            if (prev_i < i):
                prev_sum += data[prev_i]
            else:
                break
        one.append(prev_sum)
        one.append(prev_sum + data[i])
        percentage.append(one)
    return percentage
