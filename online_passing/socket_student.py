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
    index_question = int(data["index"]) - 1

    print(index_question, "hahahahahahhaahahahhaahah")
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

@socket.on("reconnect")
def reconnect(data):
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
        flask_login.current_user.user_profile.answering_answer = "відповідає"
        DATABASE.session.commit()
        emit("page_result", room=data["code"], broadcast=True)
    else:
        emit("page_waiting", room=data["code"], broadcast=True)

    emit("update_users", user_list, room=data["code"], broadcast=True)
    # user_list = []
    # print(users_rooms.items, "hoho")
    # for email, username in users_rooms[data["code"]].items():
    #     user_list.append({
    #         "username": username,
    #         "email": email,
    #         "ready": "not"
    #     })

    # emit("update_users", user_list, room=data["code"], broadcast=True)
# @socket.on("get_question")
# def handle_get_question(data_index):
#     if data_index and "index" in data_index:
#         question_index = int(data_index["index"])
#     else:
#         question_index = 0

    
#     test_id = data_index["test_id"]
#     test : Test = Test.query.get(int(test_id))

#     questions = test.questions.split("?%?")
#     answers_blocks = test.answers.split("?@?")
#     test_time = test.question_time.split("?#?")
#     types = test.type_questions.split("?$?")

#     correct_answers = return_answers(index= question_index, test_id= int(test_id))

#     idx = question_index

#     if idx >= len(questions):
        
#         user = User.query.get(int(flask_login.current_user.id))
#         user.user_profile.count_tests += 1
#         last_tests = user.user_profile.last_passed.split(" ")

#         if len(last_tests) < 5:
#             if str(test.id) not in last_tests:
#                 last_tests.append(str(test.id))
#         else:
#             if str(test.id) not in last_tests:
#                 last_tests[r.randint(a = 0, b = 3)] = str(test.id)

#         string_last_tests = " ".join(last_tests)

#         user.user_profile.last_passed = string_last_tests

#         test.test_profile.amount_passes += 1

#         DATABASE.session.commit()
#         emit("question", {
#             "question": "Кінець",
#         })
#         return

#     current_question = questions[idx]
#     test_time = test_time[idx]
#     current_type = types[idx]

#     # Получаем варианты ответов и убираем маркеры
#     current_answers_list = answers_blocks[idx].split("?@?")
#     current_answers = []

#     current_answers_clear = answers_blocks[idx]
#     # тернарный опертор
#     type_question = "many_answers" if current_answers_clear.count("+") > 2 else "one_answer"

        
#     for ans in current_answers_list:
#         ans_clean = ans.replace("(?%+", "").replace("+%?)", "*|*|*").replace("(?%-", "").replace("-%?)", "*|*|*")
#         current_answers.append(ans_clean)

#     # print(current_answers, "lol")
#     current_answers = current_answers[0].split('*|*|*')
#     print(current_answers, "loli")

#     print(current_answers, "loli")


#     path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(test.user.email), "user_tests", str(test.title_test), str(idx + 1)))
#     if exists(path):
#         name_img = None
#         for small_path in os.listdir(path):
#             if small_path not in ["1", "2", "3", "4"]:
#                 name_img = small_path
#                 break            
#     else:
#         name_img = None

#     index_img = idx + 1
#     email= test.user.email
#     title= test.title_test

#     if name_img:
#         img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{idx + 1}/{name_img}")
#     else:
#         img_url = "not"

#     del current_answers[-1]

#     # проверка на то что есть ли в ответах картинки или нет
#     image_urls = ["none", "none", "none", "none"]
#     if exists(path):
#         for index in range(1, 5):
#             current_path = join(path, str(index))
#             if exists(current_path) and len(os.listdir(current_path)) > 0:
#                 url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{idx + 1}/{str(index)}/{os.listdir(current_path)[0]}")
#                 image_urls[index - 1] = url

#     print(image_urls, "url")

#     emit("question", {
#         "answers_image": image_urls,
#         "type": current_type,
#         "question": current_question,
#         "answers": current_answers,
#         "index": question_index + 1,
#         "amount_question": len(questions),
#         "test_time": int(test_time) if test_time.isdigit() else test_time,
#         "question_img": img_url if name_img else "not",
#         "correct_answers": correct_answers,
#         "value_bonus": int(flask_login.current_user.user_profile.percent_bonus) if flask_login.current_user.is_authenticated else "0"
#     })


# @socket.on("next_question")
# def handle_next_question(data_index):
#     print("next_question")

#     test_id = data_index["test_id"]
#     test = Test.query.get(int(test_id))

#     if 'value_bonus' in data_index.keys():
#         if int(data_index["value_bonus"]) > 0 and flask_login.current_user.is_authenticated:
#             user = User.query.get(int(flask_login.current_user.id))
#             user.user_profile.percent_bonus += int(data_index["value_bonus"])

#             if user.user_profile.percent_bonus >= 100:
#                 user.user_profile.percent_bonus = 0
#                 user.user_profile.count_money += 20
#             if user.user_profile.percent_bonus is not None:
#                 DATABASE.session.commit()
    
#     questions = test.questions.split("?%?")
#     answers_blocks = test.answers.split("?@?")
#     types = test.type_questions.split("?$?")

#     idx = int(data_index["index"])

#     correct_answers = return_answers(index= idx, test_id= int(test_id))

#     # Проверка на конец теста
#     if idx >= len(questions):
#         if flask_login.current_user.is_authenticated:
#             user = User.query.get(int(flask_login.current_user.id))
#             user.user_profile.count_tests += 1
#             last_tests = user.user_profile.last_passed.split(" ")

#             max_tests = 25
#             if len(last_tests) < max_tests:
#                 if str(test.id) not in last_tests:
#                     last_tests.append(str(test.id))
#             else:
#                 if str(test.id) not in last_tests:
#                     last_tests[r.randint(0, max_tests - 2)] = str(test.id)

#             string_last_tests = " ".join(last_tests)

#             user.user_profile.last_passed = string_last_tests
#             print("kasha", string_last_tests)

#         test.test_profile.amount_passes += 1

#         DATABASE.session.commit()
#         emit("question", {
#             "question": "Кінець",
#         })
#         return

#     current_question = questions[idx]
#     current_answers_list = answers_blocks[idx].split("?@?")
#     current_answers = []
#     current_type = types[idx]

#     current_answers_clear = answers_blocks[idx]
#     type_question = "many_answers" if current_answers_clear.count("+") > 2 else "one_answer"

#     test_time = test.question_time.split("?#?")
#     test_time = test_time[idx]

#     for ans in current_answers_list:
#         ans_clean = ans.replace("(?%+", "").replace("+%?)", "*|*|*").replace("(?%-", "").replace("-%?)", "*|*|*")
#         current_answers.append(ans_clean)


#     # print(current_answers, "lol")
#     current_answers = current_answers[0].split('*|*|*')

#     if current_answers[-1] == '':
#         del current_answers[-1]
    

#     path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(test.user.email), "user_tests", str(test.title_test), str(idx + 1)))
    
#     if exists(path):
#         name_img = None
#         for small_path in os.listdir(path):
#             if small_path not in ["1", "2", "3", "4"]:
#                 name_img = small_path
#                 break            
#     else:
#         name_img = None

#     index_img = idx + 1
#     email=test.user.email
#     title=test.title_test
#     if name_img:
#         img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{idx + 1}/{name_img}")
#     else:
#         img_url = "not"

#     # проверка на то что есть ли в ответах картинки или нет
#     image_urls = ["none", "none", "none", "none"]
#     if exists(path):
#         for index in range(1, 5):
#             current_path = join(path, str(index))
#             if exists(current_path) and len(os.listdir(current_path)) > 0:
#                 url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{idx + 1}/{str(index)}/{os.listdir(current_path)[0]}")
#                 image_urls[index - 1] = url

#     print(image_urls, "url")
#     emit("question", {
#         "answers_image": image_urls,
#         "type": current_type,
#         "question": current_question,
#         "answers": current_answers,
#         "index": int(data_index["index"]) + 1,
#         "amount_question": len(questions),
#         "test_time": int(test_time) if test_time.isdigit() else test_time,
#         "user_email": flask_login.current_user.email if flask_login.current_user.is_authenticated else None,
#         "question_img": img_url if name_img else "not",
#         "correct_answers": correct_answers,
#         "value_bonus": int(flask_login.current_user.user_profile.percent_bonus) if flask_login.current_user.is_authenticated else None,
#         "check_reload": f"da/{str(flask_login.current_user.user_profile.count_money)}" if flask_login.current_user.is_authenticated and flask_login.current_user.user_profile.percent_bonus == 0 else "not" 
#     })