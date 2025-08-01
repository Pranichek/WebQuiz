from flask_socketio import join_room, emit, disconnect
from Project.socket_config import socket
from flask_login import current_user
import pyperclip, flask, flask_login
from .json_functions import read_json, save_json
from os.path import abspath, join
from home.models import User
from flask import session


users_rooms = {}

# "3499384":{
#     "email":username
# }

@socket.on("join_room")
def handle_join(data):
    username = data["username"]
    room = data["room"]
    email = data["email"]
    flag = data["flag"]

    print(flag, "flag")

    join_room(room)

    if room not in users_rooms:
        if flag != "student":
            flag = True
            users_rooms[room] = {}
            flag = True
        else:
            flag = False
            emit(
                "fake_room",
                {"email": email}
            )
    
    if flag:
        users_rooms[room][email] = username

        emit("user_joined", {"username": username}, room=room, broadcast= True)

        user_list = []

        for email, username in users_rooms[room].items():
            user_list.append({
                "username": username,
                "email": email
            })


        emit("update_users", user_list, room=room, broadcast=True)
    # "user_joined" - назва запиту через socket
    # {"username": username} - дані, що відправляємо через сокет
    # room - назва кімнати у яку прийден цей запит
    #  broadcast - параметр, який відповдає за надсилання даних користувачам, які знаходяться у цій кімнаті
    
    

@socket.on("send_message")
def handle_send_message(data):
    room = data["room"]
    sender = data["sender"]
    message = data["message"]

    dict = {
        "username": data["sender"],
        "message": data["message"],
        "email": data["email"]
    }
    path_file = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", data["email_mentor"] ,  "qrcodes", "chat.json"))
    data_chat = read_json(path_json= path_file)
    data_chat.append(dict)
    save_json(data= data_chat, path_json= path_file)

    email_user = data["email"]
    user_by_email : User = User.query.filter_by(email = email_user).first()


    emit("receive_message", {"sender": sender, "message": message, "email": data["email"], "size_email": user_by_email.size_avatar}, room=room, include_self=False, broadcast= True)

@socket.on("start_passing")
def handle_start_test(data):
    room = data["room"]

    emit("start_passing", {"sender": str(current_user.username)}, room=room, broadcast= True)

@socket.on("copy_code")
def handle_copy_code(data):
    pyperclip.copy(data["code_room"])


@socket.on("copy_link")
def handle_copy_link(data):
    pyperclip.copy(data["link_room"])


@socket.on("mentor_email")
def save_mentor_email(data):
    email = data["email"]

    path_file = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", email,  "qrcodes", "chat.json"))
    chat_data = read_json(path_json= path_file)

    emit("load_chat", {"chat_data":chat_data, "user_email": current_user.email, "mentor_email": email}, room=data["room"])

@socket.on('disconnect')
def handle_disconnect():
    email = flask_login.current_user.email  

    for room in list(users_rooms):
        if email in users_rooms[room]:
            username = users_rooms[room][email]
            del users_rooms[room][email]  

            user_list = []

            for email, username in users_rooms[room].items():
                user_list.append({
                    "username": username,
                    "email": email
                })

            emit("update_users", user_list, room=room)


@socket.on("delete_user")
def handler_delete(data):
    email = data["email"]
    email_kicked = data["email"]
    
    for room in list(users_rooms):
        if email in users_rooms[room]:
            del users_rooms[room][email_kicked]  

            user_list = []

            for email, username in users_rooms[room].items():
                user_list.append({
                    "username": username,
                    "email": email
                })


            emit("update_users", user_list, room=room)
            emit("leave_user", {"email": email_kicked}, room = room, broadcast=True)
