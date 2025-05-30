'''
Файл, де є код для отримання даних про тест, якщо користувач натиснув на якийсь тест на головній сторінці ,і хоче 
його пройти або зберегти у особистий профіль
'''
import flask
from flask_login import current_user
from .models import Test


def render_data_test():
    if current_user.is_authenticated:
        test_id = flask.request.args.get("id_test")
        test = Test.query.get(int(test_id))

        response = flask.make_response(
            flask.render_template(
            template_name_or_list = "test_data.html",
            test = test
        )
        ).set_cookie(key = "index_question", value = "0", path="/")

        if flask.request.method == "POST":
            response = flask.make_response(
                flask.redirect(
                   "/passig_test"
                )
            )

            response.set_cookie(key = "index_question", value = "0", path="/")

            return response
        
        response = flask.make_response(
            flask.render_template(
                "test_data.html", 
                test= test)
        )
        response.set_cookie(key="index_question", value="0", path="/")
        return response
    else:
        return flask.redirect("/")