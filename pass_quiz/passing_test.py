'''
Файл, де знаходиться код сторінки проходження тесту
'''

import flask
from flask_login import current_user
from quiz.models import Test

def render_passing_test():
    if current_user.is_authenticated:
        test_id = flask.request.cookies.get("test_id")

        flask.session["number-question"] = 0

        return flask.render_template(
            template_name_or_list = 'passing_test.html',
            user = current_user,
            bonus_value = current_user.user_profile.percent_bonus,
            test_page = True
            )

    else:
        return flask.redirect("/")