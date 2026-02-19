from flask_socketio import join_room, emit
from Project.socket_config import socket
from flask_login import current_user
import pyperclip, flask, flask_login
# from .json_functions import read_json, save_json
from os.path import abspath, join
from home.models import User
from .models import Rooms
from Project.db import DATABASE
from .generate_code import generate_code
import qrcode, os
from os.path import exists
from .del_files import delete_files_in_folder
from flask import request


@socket.on("join_room")
def handle_join(data):
    if "room" in data.keys():
        room_code = data["room"]
        join_room(room_code)
    else:
        room_code = None

    flag = data["flag"]


    room = Rooms.query.filter_by(room_code=room_code).first()

    if not room:
        if flag != "student":
            existing_room = Rooms.query.filter_by(user_id=current_user.id).first()
            if not existing_room:
                code = generate_code()
                room = Rooms(
                    room_code=code,
                    user_id=current_user.id,
                    id_test=data["id_test"]
                )
                room_code = code
                DATABASE.session.add(room)
                join_room(code)
                 # qrcode - 
                # Створюємо QR-код(об'єкт) з посиланням на кімнату
                qr = qrcode.QRCode(
                    # корекцыя помилок - висока
                    error_correction = qrcode.constants.ERROR_CORRECT_H, 
                    # розмір qrcode
                    box_size = 15,
                    # розмір рамки навколо qrcode
                    border = 2
                )
                # задаємо посилання на яке буде вести QR-код
                qr.add_data(f"https://openhandedly-exemptible-abrielle.ngrok-free.dev/input_username?room_code={code}")
                # створюємо QR-код, але у вигляді закодовоного коду
                qr.make(fit = True)

                # створюємо зображення QR-коду
                image = qr.make_image(
                    # кольори QR-коду
                    fill_color = '#000000',
                    # колір фону QR-коду
                    back_color = "#ffffff",
                )

                # зберігаємо зображення QR-коду в папку користувача
                if not exists(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "qrcodes"))):
                    os.makedirs(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "qrcodes")))
                if not os.path.exists(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "qrcodes", f"{code}.png"))):
                    delete_files_in_folder(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "qrcodes")))
                    with open((abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "qrcodes", "chat.json"))), "w") as f:
                        f.write("")

                image.save(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "qrcodes", "code.png")))

                

            DATABASE.session.commit()

        else:
            emit("fake_room", {"email": current_user.email})
            return
    else:
        if current_user not in room.users:
            room.users.append(current_user)
            DATABASE.session.commit()


    emit("user_joined", {"username": current_user.username}, room=room_code, broadcast=True)
    # -------------
    url_qrcode = flask.url_for("profile.static", filename = f"images/edit_avatar/{flask_login.current_user.email}/qrcodes/code.png")
    emit("set_qrcode", {"url_qrcode":url_qrcode})
    # ------
    user_list = []
    room = Rooms.query.filter_by(room_code=room_code).first()
    # тернарній опертор
    user_ids = room.users if room and room.users else []


    for user in user_ids:
        # user = User.query.get(int(user_id))
        if user and int(user.id) != int(room.user_id):
            avatar_url = flask.url_for('profile.static', filename=f'images/edit_avatar/{user.name_avatar}')
            pet_url = flask.url_for(
                'profile.static',
                filename=f'images/pets_id/{user.user_profile.pet_id}.png'
            )
            
            # user_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
            user_list.append({
                "username": user.username,
                "ready": user.user_profile.answering_answer,
                "count_points": user.user_profile.count_points,
                "id": user.id,
                "email": user.email,
                "user_avatar": avatar_url,
                "pet_img": pet_url,
            })

    emit("update_users", {"user_list":user_list, "code":room_code, "id_test": room.id_test}, room=room_code, broadcast=True)


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
    # path_file = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", data["email_mentor"], "qrcodes", "chat.json"))
    # data_chat = read_json(path_json=path_file)
    # data_chat.append(dict_data)
    # save_json(data=data_chat, path_json=path_file)

    email_user = data["email"]
    user_by_email : User = current_user
    img_url = flask.url_for("profile.static",filename=f"images/edit_avatar/{user_by_email.name_avatar}")

    emit("receive_message", {
        "sender": sender,
        "message": message,
        "email": email_user,
        "size_email": user_by_email.size_avatar,
        "name_avatar": user_by_email.name_avatar,
        "avatar_img":img_url
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
    # chat_data = read_json(path_json=path_file)
    # emit("load_chat", {"chat_data": chat_data, "user_email": current_user.email, "mentor_email": email, "id_test": data["id_test"]}, room=data["room"])

@socket.on("connect_again")
def connect_to_room(data):
    join_room(data["code"])

@socket.on("disconnect")
def handle_disconnect():
    user = current_user
        
    for room in user.rooms:
        if user in room.users:
            if user in room.sockets_users:
                room.sockets_users.remove(user)

            DATABASE.session.commit()

            user_ids = room.sockets_users if room and room.users else []

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
                        "ready": user.user_profile.answering_answer,
                        "count_points": user.user_profile.count_points,
                        "user_avatar": avatar_url,
                        "pet_img": pet_url,
                        "id": user.id,
                        "email": user.email
                    })

            # emit("update_users", {"user_list":user_list, "code":room.room_code, "id_test": room.id_test}, room= room.room_code, broadcast=True)



@socket.on("delete_user")
def delete_user(data):
    user = User.query.get(int(data["id"]))
    if not user:
        return
    
    for room in user.rooms:
        if user in room.users:
            if user in room.users:
                room.users.remove(user)
            if user in room.sockets_users:
                room.sockets_users.remove(user)

            DATABASE.session.commit()
            

            emit(
                "leave_user",
                {"id": user.id},
                room=room.room_code,
                broadcast=True
            )

            user_list = []
            for u in room.users:
                if u.id == room.user_id:
                    continue

                avatar_url = flask.url_for(
                    'profile.static',
                    filename=f'images/edit_avatar/{u.name_avatar}'
                )
                pet_url = flask.url_for(
                    'profile.static',
                    filename=f'images/pets_id/{u.user_profile.pet_id}.png'
                )

                user_list.append({
                        "username": u.username,
                        "ready": u.user_profile.answering_answer,
                        "count_points": u.user_profile.count_points,
                        "user_avatar": avatar_url,
                        "pet_img": pet_url,
                        "id": u.id,
                        "email": u.email
                    })

            emit(
                "update_users",
                {"user_list": user_list, "code": room.room_code, "id_test": room.id_test},
                room=room.room_code,
                broadcast=True
            )

@socket.on("block_user")
def block_user(data):
    room_code = data.get("room")
    user_id = data.get("id")

    room = Rooms.query.filter_by(room_code=room_code).first()
    user = User.query.get(int(user_id))

    if not room or not user:
        return

    if not room.blocked_users.filter_by(id=user.id).first():
        room.blocked_users.append(user)

    if user in room.users:
        room.users.remove(user)
    
    if user in room.sockets_users:
        room.sockets_users.remove(user)

    DATABASE.session.commit()

    emit("you_are_blocked", {"user_id": user.id}, room=room.room_code)

    user_list = []
    for u in room.users:
        if u.id == room.user_id:
            continue
            

        user_list.append({
            "username": u.username,
            "ready": u.user_profile.answering_answer,
            "count_points": u.user_profile.count_points,
            "id": u.id,
            "email": u.email
        })

    emit("update_users", {"user_list": user_list, "code": room.room_code, "id_test": room.id_test}, room=room.room_code, broadcast=True)

@socket.on("update_student_time_MS")
def update_student_time(data):
    emit("update_student_time_SS", {"time": data["time"]}, room = data["room"])

@socket.on("end_lesson")
def end_lesson(data):
    emit("end_lesson", room = data["room"], broadcast=True)
