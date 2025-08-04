import flask, flask_login
from Project.login_check import login_decorate

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