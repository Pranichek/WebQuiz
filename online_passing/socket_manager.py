from flask_socketio import join_room, emit, disconnect
from Project.socket_config import socket
from flask_login import current_user
import pyperclip, flask
from .json_functions import read_json, save_json
from os.path import abspath, join
from home.models import User
from .models import Rooms
from Project.db import DATABASE

@socket.on("join_room")
def handle_join(data):
    room_code = data["room"]
    flag = data["flag"]

    join_room(room_code)

    room = Rooms.query.filter_by(room_code=room_code).first()

    if not room:
        if flag != "student":
            existing_room = Rooms.query.filter_by(user_id=current_user.id).first()
            if not existing_room:
                room = Rooms(room_code=room_code, user_id=str(current_user.id), users=f'{current_user.id}')
                DATABASE.session.add(room)
                
            else:
                existing_room.room_code = room_code 
                existing_room.users = f'{current_user.id}' 
                room = existing_room

            DATABASE.session.commit()
        else:
            emit("fake_room", {"email": current_user.email})
            return
    else:
        user_ids = room.users.split() 
        if str(current_user.id) not in user_ids:
            user_ids.append(str(current_user.id))
            room.users = " ".join(user_ids)
            DATABASE.session.commit()

    emit("user_joined", {"username": current_user.username}, room=room_code, broadcast=True)

    user_list = []
    room = Rooms.query.filter_by(room_code=room_code).first()
    user_ids = room.users.split() if room and room.users else []

    for user_id in user_ids:
        user = User.query.get(int(user_id))
        if user:
            user_list.append({
                "username": user.username,
                "email": user.email,
                "ready": user.user_profile.answering_answer
            })

    emit("update_users", user_list, room=room_code, broadcast=True)

@socket.on("send_message")
def handle_send_message(data):
    room = data["room"]
    sender = data["sender"]
    message = data["message"]

    dict_data = {
        "username": sender,
        "message": message,
        "email": data["email"]
    }
    path_file = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", data["email_mentor"], "qrcodes", "chat.json"))
    data_chat = read_json(path_json=path_file)
    data_chat.append(dict_data)
    save_json(data=data_chat, path_json=path_file)

    email_user = data["email"]
    user_by_email = User.query.filter_by(email=email_user).first()

    emit("receive_message", {
        "sender": sender,
        "message": message,
        "email": email_user,
        "size_email": user_by_email.size_avatar
    }, room=room, include_self=False, broadcast=True)

@socket.on("start_passing")
def handle_start_test(data):
    room = data["room"]
    emit("start_passing", {"sender": str(current_user.username), "code": room}, room=room, broadcast=True)

@socket.on("copy_code")
def handle_copy_code(data):
    pyperclip.copy(data["code_room"])

@socket.on("copy_link")
def handle_copy_link(data):
    pyperclip.copy(data["link_room"])

@socket.on("mentor_email")
def save_mentor_email(data):
    email = data["email"]

    path_file = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", email, "qrcodes", "chat.json"))
    chat_data = read_json(path_json=path_file)

    emit("load_chat", {"chat_data": chat_data, "user_email": current_user.email, "mentor_email": email}, room=data["room"])

@socket.on("connect_again")
def connect_to_room(data):
    join_room(data["code"])

# @socket.on('disconnect')
# def handle_disconnect():
#     email = current_user.email
#     user_id = str(current_user.id)

#     rooms = Rooms.query.all()
#     for room in rooms:
#         if room.users:
#             user_ids = room.users.split()
#             if user_id in user_ids:
#                 user_ids.remove(user_id)
#                 room.users = " ".join(user_ids)
#                 DATABASE.session.commit()

#                 user_list = []
#                 for uid in user_ids:
#                     user = User.query.get(int(uid))
#                     if user and user.id != room.user_id:
#                         user_list.append({
#                             "username": user.username,
#                             "email": user.email,
#                             "ready": user.user_profile.answering_answer
#                         })
                
#                 emit("update_users", user_list, room=room.room_code)
#                 break

@socket.on("delete_user")
def handler_delete(data):
    email_kicked = data["email"]
    user = User.query.filter_by(email=email_kicked).first()
    if not user:
        return

    user_id_str = str(user.id)

    rooms = Rooms.query.all()
    for room in rooms:
        if room.users:
            user_ids = room.users.split()
            if user_id_str in user_ids:
                user_ids.remove(user_id_str)
                room.users = " ".join(user_ids)
                DATABASE.session.commit()

                user_list = []
                for uid in user_ids:
                    u = User.query.get(int(uid))
                    if u:
                        user_list.append({
                            "username": u.username,
                            "email": u.email,
                            "ready": user.user_profile.answering_answer
                        })

                emit("update_users", user_list, room=room.room_code)
                emit("leave_user", {"email": email_kicked}, room=room.room_code, broadcast=True)
                break
