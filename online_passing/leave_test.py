from Project.socket_config import socket
from Project.db import DATABASE
from home.models import User
from .models import Rooms
from flask_socketio import emit
import flask_login, flask

@socket.on("leave_test")
def leave_test(data):
    room : Rooms = Rooms.query.filter_by(room_code = data["room"]).first()

    user_id_str = str(flask_login.current_user.id)

    rooms = Rooms.query.all()
    for room in rooms:
        if room.users:
            user_ids = room.users.split()
            if user_id_str in user_ids:
                user_ids.remove(user_id_str)
                room.users = " ".join(user_ids)

                check_room = room.check_socket.split()
                if user_id_str in check_room:
                    check_room.remove(user_id_str)
                room.check_socket = " ".join(check_room)
                DATABASE.session.commit()

                user_list = []
                for user_id in user_ids:
                    user = User.query.get(int(user_id))
                    if user and int(user.id) != int(room.user_id):
                        avatar_url = flask.url_for('profile.static', filename=f'images/edit_avatar/{user.name_avatar}')
                        pet_url = flask.url_for(
                            'profile.static',
                            filename=f'images/pets_id/{user.user_profile.pet_id}.png'
                        )
                        user_list.append({
                            "username": user.username,
                            "email": user.email,
                            "ready": user.user_profile.answering_answer,
                            "count_points": user.user_profile.count_points,
                            "user_avatar": avatar_url,
                            "pet_img": pet_url,
                            "id":user.id
                        })
                emit("update_users", {"user_list":user_list, "code":data["room"], "id_test": room.id_test}, room=data["room"], broadcast=True)
                break