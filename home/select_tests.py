import flask, flask_login
from quiz.models import Test



def render_select_tests():
    tests = Test.query.filter(Test.check_del != "deleted").all()


    return flask.render_template(
        "select_tests.html",
        tests = tests,
        page_name = "Різноманітні тести"
    )