import flask
import flask_login

def render_profile():
    if flask.request.method == "POST":
        flask.session.clear()
        
    if flask_login.current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "profile.html" 
        )
    else:
        return flask.redirect("/")