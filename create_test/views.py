import flask
import flask_login



def render_test_editor(): 
    
    if flask_login.current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "test_editor.html"
        )
    else:
        return flask.redirect("/")