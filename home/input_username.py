import flask
import flask_login
import random
import secrets  # Для генерації безпечних токенів
from .models import User
from userprofile.models import DataUser
from Project.db import DATABASE
from online_passing.models import Rooms

def render_input_username():
    room_code = flask.request.args.get("room_code")
    
    if not room_code:
        return flask.redirect("/")

    if flask.request.method == "POST":
        room = Rooms.query.filter_by(room_code=room_code).first()

        if not room:
            return 

        if not flask_login.current_user.is_authenticated:
            username = flask.request.form.get("username")
            
            unique_id = secrets.token_hex(8)
            
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

            room.users.append(user)

            try:
                DATABASE.session.add(user)
                DATABASE.session.commit()
                
                flask_login.login_user(user)
                flask.session["current_room_code"] = room_code
                return flask.redirect(f"student?room_code={room_code}")
                
            except Exception as eroorr:
                DATABASE.session.rollback()

        else:
            if flask_login.current_user in room.blocked_users:
                return flask.redirect("/")
            
            flask_login.current_user.username = flask.request.form.get("username")
            
            if flask_login.current_user not in room.users:
                room.users.append(flask_login.current_user)

            try:
                DATABASE.session.commit()
                flask.session["current_room_code"] = room_code
                return flask.redirect(f"student?room_code={room_code}")
            except Exception as e:
                DATABASE.session.rollback()
                print(f"Помилка при оновленні: {e}")

    return flask.render_template(
        "input_username.html",
        registration_page = True,
        code = room_code,
        home_page = True
    )