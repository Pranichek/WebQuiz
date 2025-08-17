import flask, flask_login, os
from Project.socket_config import socket
from quiz.models import Test
from .models import Rooms
from home.models import User
from flask_socketio import emit, join_room
from Project.db import DATABASE
from operator import itemgetter
# from .socket_manager import users_rooms

@socket.on("users_results")
def users_results(data):
    user_list = []
    room = Rooms.query.filter_by(room_code= data["room"]).first()
    user_ids = room.users.split() if room and room.users else []

    for user_id in user_ids:
        user : User  = User.query.get(int(user_id))
        user.user_profile.answering_answer = "відповідає"
        DATABASE.session.commit()
        if user and user.id != flask_login.current_user.id:
            avatar_url = flask.url_for('profile.static', filename=f'images/edit_avatar/{user.email}/{user.name_avatar}')
            user_list.append({
                "username": user.username,
                "email": user.email,
                "ready": user.user_profile.answering_answer,
                "count_points": user.user_profile.count_points,
                "user_avatar": avatar_url,
                "avatar_size": user.size_avatar,
                "last_answer": user.user_profile.last_answered.split("/")[0],
                "accuracy": user.user_profile.last_answered.split("/")[1]
            })

    # черещ встроенній модуль делаем филтрацию словаря за "count_points" и делаем реверс чтобі біло от большего к меньшему
    user_list = sorted(user_list, key=itemgetter("count_points"), reverse=True)

    emit("list_results", user_list)

@socket.on("load_question")
def load_question_mentor(data):
    join_room(data["room"])

    user_list = []
    room = Rooms.query.filter_by(room_code= data["room"]).first()
    user_ids = room.users.split() if room and room.users else []

    for user_id in user_ids:
        user : User  = User.query.get(int(user_id))
        user.user_profile.answering_answer = "відповідає"
        DATABASE.session.commit()
        if user and user.id != flask_login.current_user.id:
            user_list.append({
                "username": user.username,
                "email": user.email,
                "ready": user.user_profile.answering_answer,
                "count_points": user.user_profile.count_points
            })

    emit("update_users", user_list, room=data["room"], broadcast=True)


@socket.on("end_question")
def end_question(data):
    code = data["code"]
    room = Rooms.query.filter_by(room_code= data["code"]).first()
    user_ids = room.users.split() if room and room.users else []

    for user_id in user_ids:
        user : User = User.query.get(int(user_id))
        user.user_profile.answering_answer = "відповідає"

    emit("page_result", room = code, broadcast=True)


@socket.on("next_one")
def next_question(data):
    print("kakaska")
    index_question = int(data["index"])
    test_id = int(data["test_id"])
    room_code = data["room"]

    test : Test = Test.query.get(test_id)

    if index_question < test.questions.count("?%?") + 1:
        emit("next_question", {"status": "ok"}, room=room_code, broadcast=True)
    else:
        emit("end_test", {"status": "ok"}, room=room_code, broadcast=True)


@socket.on("add_time")
def add_time(data):
    emit("add_some_time", room=data["code"], broadcast= True)

@socket.on('end_question')
def end_question(data):
    emit("end_this_question", room=data["code"], broadcast= True, include_self=False)

@socket.on("stopTime")
def stop_time(data):
    room_code = data["code"]
    emit("stop_time", room = room_code, broadcast = True)
