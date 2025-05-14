import flask, os
from .models import Test
from Project.db import DATABASE
from os.path import abspath, join

def render_test():
    if flask.request.method == "POST":
        test_title = flask.request.form["test_title"]
        question_amount = flask.request.form["question_amount"]
        questions = flask.request.form["questions"]
        answers = flask.request.form["answers"]

        if Test.query.filter_by(title_test = test_title).first() is None:
            test = Test(
                amount_question = question_amount,
                title_test = test_title,
                questions = questions,
                answers = answers
            )

            DATABASE.session.add(test)
            DATABASE.session.commit()

            os.mkdir(path = abspath(join(__file__, "..", "static", str(test_title))))
            
    return flask.render_template(template_name_or_list= "test.html")