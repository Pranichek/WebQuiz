# import flask
# from flask_login import current_user
# import functools

# def login_decorate(function: object):
#     @functools.wraps(function)
#     def handler(*args, **kwargs):
#         cookieQuiz = flask.request.cookies.get("cookieBy")
#         # робимо перевірку на те що треба підтвердити використання cookie
#         if current_user.is_authenticated and cookieQuiz is None:
#             flask.session.clear()
#             return flask.redirect("/")
#         # Перевірка на те що користувач зареєстрован
#         if current_user.is_authenticated:
#             return function(*args, **kwargs)
#         else:
#             return flask.redirect("/")
#     return handler

import flask
from flask_login import current_user
import functools

def login_decorate(function: object):
    @functools.wraps(function)
    def handler(*args, **kwargs):
        print("lolo")
        # Если не авторизован ИЛИ нет профиля — отправляем на вход
        if not current_user.is_authenticated or current_user.user_profile is None:
            # Опционально: можно здесь автоматически создать профиль, если его нет
            return flask.redirect("/") 
        
        return function(*args, **kwargs)
    return handler