import flask
from flask_login import current_user
import functools

def login_decorate(function: object):
    @functools.wraps(function)
    def handler(*args, **kwargs):
        if current_user.is_authenticated:
            return function(*args, **kwargs)
        else:
            return flask.redirect("/")
    return handler

        