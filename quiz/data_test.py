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

        if flask.request.method == "POST":
            return flask.redirect("/passig_test")
        
        return flask.render_template(
            template_name_or_list = "test_data.html",
            test = test
        )
    else:
        return flask.redirect("/")