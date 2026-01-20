import flask, flask_login
from .models import User
from userprofile.models import DataUser
import random
from Project.db import DATABASE


def render_input_username():
    room_code = flask.request.args.get("room_code")
    if flask.request.method == "POST":

        if not flask_login.current_user.is_authenticated:
            print("soso")
            username = flask.request.form.get("username")

            avatar = f"default_avatar{random.randint(1,5)}.svg"
            user = User(
                    username = username,
                    password = 1,
                    email = "quest@gmail.com",
                    is_mentor = False,
                    name_avatar = avatar
                )
            
            profile = DataUser()
            user.user_profile = profile

            DATABASE.session.add(user)
            DATABASE.session.commit()

            flask_login.login_user(user)
            if username:
                return flask.redirect(f"student?room_code={room_code}")
        else:
            flask_login.current_user.username = flask.request.form.get("username")
            DATABASE.session.commit()
            return flask.redirect(f"student?room_code={room_code}")

    return flask.render_template(
        "input_username.html",
        registration_page = True,
        code = room_code,
        home_page = True
    )
