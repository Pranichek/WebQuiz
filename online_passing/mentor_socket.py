import flask, flask_login, os
from Project.socket_config import socket
from quiz.models import Test
from .models import Rooms
from home.models import User
from flask_socketio import emit, join_room
from Project.db import DATABASE
from operator import itemgetter
from os.path import exists, join, abspath
# from .socket_manager import users_rooms

@socket.on("users_results")
def users_results(data):
    user_list = []
    room = Rooms.query.filter_by(room_code= data["room"]).first()
    user_ids = room.users.split() if room and room.users else []

    test : Test = Test.query.get(int(data["test_id"]))
    index_question = int(data["index_question"])
    text_question = test.questions.split("?%?")[index_question]
    type_question = test.type_questions.split('?$?')[index_question]

    answers = test.answers.split("?@?")[index_question]
    clear_answers = None
    ans_clean = answers.replace("(?%+", "").replace("+%?)", "*|*|*").replace("(?%-", "").replace("-%?)", "*|*|*")
    clear_answers = ans_clean.split('*|*|*')
    clear_answers.remove("")

    count_people_answes = []
    for answer in clear_answers:
        count_people_answes.append(0)

    for user_id in user_ids:
        user : User  = User.query.get(int(user_id))
        user.user_profile.answering_answer = "відповідає"
        DATABASE.session.commit()
        if user and user.id != flask_login.current_user.id:
            avatar_url = flask.url_for('profile.static', filename=f'images/edit_avatar/{user.email}/{user.name_avatar}')
            
            count = 0
            count_image = 1
            users_answers = user.user_profile.last_answered.split("/")[0].split()
            for user_answer in users_answers:
                if type_question != "input-gap":
                    if user_answer == "image?#$?image":
                        users_answers[count] = f"зображення"
                        count_image+=1

                    users_answers[count] = f"{count+1}){users_answers[count]}"
                    count+=1

            print(users_answers, "lol")
            user_list.append({
                "username": user.username,
                "email": user.email,
                "ready": user.user_profile.answering_answer,
                "count_points": user.user_profile.count_points,
                "user_avatar": avatar_url,
                "avatar_size": user.size_avatar,
                "last_answer": users_answers,
                "accuracy": user.user_profile.last_answered.split("/")[1],
                "right_wrong": user.user_profile.last_answered.split("/")[2]
            })

            if type_question != "input-gap":
                answers = user.user_profile.last_answered.split("/")[3].split("@")
                for answer in answers:
                    if answer != '∅':
                        if int(answer) == 0:
                            count_people_answes[0] = count_people_answes[0]+1
                        elif int(answer) == 1:
                            count_people_answes[1] = count_people_answes[1]+1
                        elif int(answer) == 2:
                            count_people_answes[2] = count_people_answes[2]+1
                        else:
                            count_people_answes[3] = count_people_answes[3]+1

    if type_question != "input-gap":
        count = 0
        count_image = 1
        for answer in clear_answers:
            if answer == "image?#$?image":
                clear_answers[count] = f"зображення   {count_image}"
                count_image += 1
            count+=1

    # черещ встроенній модуль делаем филтрацию словаря за "count_points" и делаем реверс чтобі біло от большего к меньшему
    user_list = sorted(user_list, key=itemgetter("count_points"), reverse=True)

    # была ли картинка к вопросу
    path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(test.user.email), "user_tests", str(test.title_test), str(index_question + 1)))
    if exists(path):
        name_img = None
        for small_path in os.listdir(path):
            if small_path not in ["1", "2", "3", "4"]:
                name_img = small_path
                break            
    else:
        name_img = None

    email= test.user.email
    title= test.title_test
    img_url = "not"

    if name_img:
        img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index_question + 1}/{name_img}")

    
    emit("list_results", {
        "users": user_list, 
        "answers": clear_answers, 
        "count_answers":count_people_answes, 
        "type_question": type_question, 
        "text_question":text_question,
        "image_url":img_url
    })

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
            avatar_url = flask.url_for('profile.static', filename=f'images/edit_avatar/{user.email}/{user.name_avatar}')
            pet_url = flask.url_for(
                'profile.static',
                filename=f'images/pets_id/{user.user_profile.pet_id}.png'
            )

            user_list.append({
                "username": user.username,
                "email": user.email,
                "ready": user.user_profile.answering_answer,
                "count_points": user.user_profile.count_points,
                "avatar_url": avatar_url,
                "pet_img": pet_url
            })

    test : Test = Test.query.get(int(data["test_id"]))
    index_question = int(data["index"])
    text_question = test.questions.split("?%?")[index_question]
    type_question = test.type_questions.split('?$?')[index_question]
    time_question = test.question_time.split("?#?")[index_question]
    answer_options = test.answers.split("?@?")[index_question]

    path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(test.user.email), "user_tests", str(test.title_test), str(index_question + 1)))
    if exists(path):
        name_img = None
        for small_path in os.listdir(path):
            if small_path not in ["1", "2", "3", "4"]:
                name_img = small_path
                break            
    else:
        name_img = None

    email= test.user.email
    title= test.title_test

    if name_img:
        img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index_question + 1}/{name_img}")
    else:
        img_url = "not"

    # проверка на то что есть ли в ответах картинки или нет
    image_urls = ["none", "none", "none", "none"]
    if exists(path):
        for index in range(1, 5):
            current_path = join(path, str(index))
            if exists(current_path) and len(os.listdir(current_path)) > 0:
                url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index_question + 1}/{str(index)}/{os.listdir(current_path)[0]}")
                image_urls[index - 1] = url
    print("image_urls =", image_urls, "type =", type_question)

    emit("update_users", (user_list, text_question, type_question, time_question, answer_options, img_url, image_urls), room=data["room"], broadcast=True)

    


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
