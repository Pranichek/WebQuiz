import flask
import flask_login
import os
from Project.db import DATABASE
from home.models import User

def render_profile():
    user_id = flask_login.current_user.id
    user = User.query.get(user_id)
    print("user =", user)
    if flask.request.method == "POST":

        try:
            print(user_id)
            new_username = flask.request.form["username"]
            user.username = new_username
            DATABASE.session.commit()
            print("updated successfully")
        except:
            print("error")

        # flask.session.clear()
        
        
    if flask_login.current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "profile.html",
            name_avatar = flask_login.current_user.name_avatar,
            user = user
        )
    else:
        return flask.redirect("/")
    
    
def render_edit_avatar():
    if flask.request.method == "POST":
        if 'file' not in flask.request.files:
            return flask.redirect("/")
        
        file = flask.request.files["file"]
        
        path_to_avatar = os.path.abspath(os.path.join(__file__, "..", "static", "images", 'edit_avatar', str(file.filename)))
        file.save(path_to_avatar)

        flask_login.current_user.name_avatar = str(file.filename)
        DATABASE.session.commit()

    if flask_login.current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "edit_avatar.html"
        )
    else:
        return flask.redirect("/")