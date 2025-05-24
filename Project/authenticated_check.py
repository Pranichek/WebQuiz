import flask_login, flask

def config_page(function: object):
    def handler_config(*args, **kwargs):
        if flask_login.current_user.is_authenticated:
            return function()
        else:
            return flask.redirect("/")
    return handler_config
