'''
Файл, де знаходиться код сторінки проходження тесту
'''
import flask
from flask_login import current_user
from .models import Test

def render_passing_test():
    if current_user.is_authenticated:
        test_id = flask.request.cookies.get("test_id")

        if test_id is not None:
            test = Test.query.get(int(test_id))
            
            amount_questions = test.questions.count("?%?") + 1
            flask.session["number-question"] = 0

            questions = test.questions.split("?%?")
            question = questions[flask.session["number-question"]]

            if flask.request.method == "POST":
                return flask.redirect("/finish_test")
            
            return flask.render_template(
                template_name_or_list = 'passing_test.html',
                user = current_user,
                test = test,
                amount_questions = amount_questions,
                question = question
            )
        else:
            return flask.redirect("/")
    else:
        return flask.redirect("/")