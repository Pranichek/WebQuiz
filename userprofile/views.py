import flask, os, flask_login
from Project.db import DATABASE
from .render_data import create_email, render_phone_number

def render_profile():
    if flask.request.method == "POST":
        flask.session.clear()
        
    if flask_login.current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "profile.html",
            username = flask_login.current_user.username,
            email = create_email(flask_login.current_user.email),
            name_avatar = flask_login.current_user.name_avatar,
            phone_user = render_phone_number(flask_login.current_user.phone_number),
            email_folder = flask_login.current_user.email
        )
    else:
        return flask.redirect("/")
    
    
def render_edit_avatar():
    if flask.request.method == "POST":
        if 'file' not in flask.request.files:
            return flask.redirect("/")
        
        file = flask.request.files["file"]
        
        path_to_avatar = os.path.abspath(os.path.join(__file__, "..", "static", "images", 'edit_avatar', str(flask_login.current_user.email), str(file.filename)))
        file.save(path_to_avatar)

        flask_login.current_user.name_avatar = str(file.filename)
        DATABASE.session.commit()

    if flask_login.current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "edit_avatar.html"
        )
    else:
        return flask.redirect("/")