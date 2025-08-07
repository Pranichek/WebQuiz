from Project.socket_config import socket
import flask_login, flask, os, random as r
from quiz.models import Test
from flask_socketio import emit, join_room
from os.path import abspath, join, exists
from home.models import User
from .models import Rooms
from Project.db import DATABASE
from .correct_answers import return_answers

@socket.on("connect_room")
def connect_to_room(data):
    id_test = int(data["test_id"])
    room_code = data["code"]
    index_question = int(data["index"]) 

    test : Test = Test.query.get(int(id_test))

    questions = test.questions.split("?%?")
    answers_blocks = test.answers.split("?@?")
    test_time = test.question_time.split("?#?")
    types = test.type_questions.split("?$?")

    correct_answers = return_answers(index= index_question, test_id= int(id_test))

    current_question = questions[index_question]
    test_time = test_time[index_question]
    current_type = types[index_question]

    current_answers_list = answers_blocks[index_question].split("?@?")
    current_answers = []

    current_answers_clear = answers_blocks[index_question]
    type_question = "many_answers" if current_answers_clear.count("+") > 2 else "one_answer"

        
    for ans in current_answers_list:
        ans_clean = ans.replace("(?%+", "").replace("+%?)", "*|*|*").replace("(?%-", "").replace("-%?)", "*|*|*")
        current_answers.append(ans_clean)

    current_answers = current_answers[0].split('*|*|*')

    path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(test.user.email), "user_tests", str(test.title_test), str(index_question + 1)))
    if exists(path):
        name_img = None
        for small_path in os.listdir(path):
            if small_path not in ["1", "2", "3", "4"]:
                name_img = small_path
                break            
    else:
        name_img = None

    index_img = index_question + 1
    email= test.user.email
    title= test.title_test

    if name_img:
        img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index_question + 1}/{name_img}")
    else:
        img_url = "not"

    del current_answers[-1]

    # проверка на то что есть ли в ответах картинки или нет
    image_urls = ["none", "none", "none", "none"]
    if exists(path):
        for index in range(1, 5):
            current_path = join(path, str(index))
            if exists(current_path) and len(os.listdir(current_path)) > 0:
                url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index_question + 1}/{str(index)}/{os.listdir(current_path)[0]}")
                image_urls[index - 1] = url


    emit("student_question", {
        "answers_image": image_urls,
        "type": current_type,
        "question": current_question,
        "answers": current_answers,
        "index": index_question + 1,
        "amount_question": len(questions),
        "test_time": int(test_time) if test_time.isdigit() else test_time,
        "question_img": img_url if name_img else "not",
        "correct_answers": correct_answers,
        "value_bonus": "0" 
    })

    join_room(room=data["code"])

    code = data["code"]
    room = Rooms.query.filter_by(room_code=code).first()

    user_ids = room.users.split() if room.users else []
    if str(flask_login.current_user.id) not in user_ids:
        user_ids.append(str(flask_login.current_user.id))
        room.users = " ".join(user_ids)
        DATABASE.session.commit()

    user_list = []
    room = Rooms.query.filter_by(room_code= data["code"]).first()
    user_ids = room.users.split() if room and room.users else []

    for user_id in user_ids:
        user = User.query.get(int(user_id))
        if user and user.id != room.user_id:
            user_list.append({
                "username": user.username,
                "email": user.email,
                "ready": user.user_profile.answering_answer
            })

    emit("update_users", user_list, room=data["code"], broadcast=True)

# @socket.on("reconnect")
# def reconnect(data):
#     join_room(room=data["code"])

#     code = data["code"]
#     room = Rooms.query.filter_by(room_code=code).first()

#     user_ids = room.users.split() if room.users else []
#     if str(flask_login.current_user.id) not in user_ids:
#         user_ids.append(str(flask_login.current_user.id))
#         room.users = " ".join(user_ids)
#         DATABASE.session.commit()

#     user_list = []
#     room = Rooms.query.filter_by(room_code= data["code"]).first()
#     user_ids = room.users.split() if room and room.users else []

#     for user_id in user_ids:
#         user = User.query.get(int(user_id))
#         if user and user.id != room.user_id:
#             user_list.append({
#                 "username": user.username,
#                 "email": user.email,
#                 "ready": user.user_profile.answering_answer
#             })

#     emit("update_users", user_list, room=data["code"], broadcast=True)

@socket.on("answered")
def answer_the_question(data):
    flask_login.current_user.user_profile.answering_answer = "відповів"
    DATABASE.session.commit()

    user_list = []
    room = Rooms.query.filter_by(room_code= data["code"]).first()
    user_ids = room.users.split() if room and room.users else []

    count_answered = 0
    count_people = 0
    for user_id in user_ids:
        user = User.query.get(int(user_id))
        if user and user.id != room.user_id:
            count_people += 1
            if user.user_profile.answering_answer == "відповів":
                count_answered += 1
            user_list.append({
                "username": user.username,
                "email": user.email,
                "ready": user.user_profile.answering_answer
            })
    if count_answered >= count_people:
        DATABASE.session.commit()
        emit("update_users", user_list, room=data["code"], broadcast=True)
        emit("page_result", room=data["code"], broadcast=True)
    else:
        emit("update_users", user_list, room=data["code"], broadcast=True)
        emit("page_waiting")

   
# сокет чтобы получить данные ответа пользователя когда он ждет
@socket.on("get_data")
def return_data(data):
    index_question = int(data["index_question"])
    id_test = int(data["id_test"])

    test : Test = Test.query.get(id_test)
    questions = test.questions.split("?%?")

    current_question = questions[index_question - 1]

    path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(test.user.email), "user_tests", str(test.title_test), str(index_question)))
    if exists(path):
        name_img = None
        for small_path in os.listdir(path):
            if small_path not in ["1", "2", "3", "4"]:
                name_img = small_path
                break            
    else:
        name_img = None

    index_img = index_question + 1
    email= test.user.email
    title= test.title_test
    img_url = "not"
    if name_img:
        img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index_question}/{name_img}")
    else:
        img_url = "not"

    
    emit(
        "show_data",
        {
            "image":img_url,
            "question": current_question
        }
    )