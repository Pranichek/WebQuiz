import flask, flask_login
from .models import User
from userprofile.models import DataUser
import random
import uuid  # генерація рандомніх строк
from Project.db import DATABASE
from online_passing.models import Rooms


def render_input_username():
    room_code = flask.request.args.get("room_code")
    if flask.request.method == "POST":

        if not flask_login.current_user.is_authenticated:
            username = flask.request.form.get("username")
            
            unique_id = str(uuid.uuid4())[:6] 
            
            avatar = f"default_avatar{random.randint(1,5)}.svg"
            
            user = User(
                    username = username, 
                    password = "1",     
                    email = f"guest_{unique_id}@gmail.com", 
                    is_mentor = False,
                    name_avatar = avatar
                )
            
            profile = DataUser()
            user.user_profile = profile

            try:
                DATABASE.session.add(user)
                DATABASE.session.commit()
                flask_login.login_user(user)
                return flask.redirect(f"student?room_code={room_code}")
            except Exception as eroorr:
                DATABASE.session.rollback()

        else:
            room : Rooms = Rooms.query.filter_by(room_code = room_code).first()
            if flask_login.current_user not in room.blocked_users:
                flask_login.current_user.username = flask.request.form.get("username")
                DATABASE.session.commit()
                return flask.redirect(f"student?room_code={room_code}")
            else:
                return flask.redirect("/")

    return flask.render_template(
        "input_username.html",
        registration_page = True,
        code = room_code,
        home_page = True
    )