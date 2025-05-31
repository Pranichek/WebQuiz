from Project.socket_config import socket
import flask_login, flask
from .models import Test
from flask_socketio import emit
import os
from os.path import abspath, join, exists


@socket.on("get_question")
def handle_get_question(data_index):
    print("get question")
    if data_index and "index" in data_index:
        question_index = int(data_index["index"])
    else:
        question_index = 0

    
    # test_id = flask.request.cookies.get("test_id")
    test_id = data_index["test_id"]
    test = Test.query.get(int(test_id))
    questions = test.questions.split("?%?")
    answers_blocks = test.answers.split("?@?")
    test_time = test.question_time.split("?#?")


    idx = question_index
    current_question = questions[idx]
    test_time = test_time[idx]

    # Получаем варианты ответов и убираем маркеры
    current_answers_list = answers_blocks[idx].split("?@?")
    current_answers = []

    current_answers_clear = answers_blocks[idx]
    type_question = "many_answers" if current_answers_clear.count("+") > 2 else "one_answer"

    ['(?%+да+%?)(?%-нет-%?)']

        
    for ans in current_answers_list:
        ans_clean = ans.replace("(?%+", "").replace("+%?)", " ").replace("(?%-", "").replace("-%?)", " ")
        current_answers.append(ans_clean)


    current_answers = current_answers[0].split(' ')

    path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "user_tests", str(test.title_test), str(idx + 1)))
    if len(os.listdir(path)) > 0:
        name_img = os.listdir(path)[0]
    else:
        name_img = None
    index_img = idx + 1
    email=flask_login.current_user.email
    title=test.title_test
    if name_img:
        img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{idx + 1}/{name_img}")
    else:
        img_url = "not"


    del current_answers[-1]
    emit("question", {
        "question": current_question,
        "answers": current_answers,
        "index": question_index + 1,
        "amount_question": len(questions),
        "test_time": int(test_time),
        "type_question": type_question,
        "question_img": img_url if name_img else "not"
    })


@socket.on("next_question")
def handle_next_question(data_index):
    print("next_question")
    if data_index["index"] == 100:
        emit("question", {
            "question": "Кінець",
        })
        return False

    test_id = data_index["test_id"]
    test = Test.query.get(int(test_id))
    questions = test.questions.split("?%?")
    answers_blocks = test.answers.split("?@?")

    idx = int(data_index["index"])
    print("Index:", idx)
    # Проверка на конец теста
    if idx >= len(questions) or data_index["index"] == 100:
        emit("question", {
            "question": "Кінець",
        })
        return

    current_question = questions[idx]
    current_answers_list = answers_blocks[idx].split("?@?")
    current_answers = []

    current_answers_clear = answers_blocks[idx]
    type_question = "many_answers" if current_answers_clear.count("+") > 2 else "one_answer"

    test_time = test.question_time.split("?#?")
    test_time = test_time[idx]

    for ans in current_answers_list:
        ans_clean = ans.replace("(?%+", "").replace("+%?)", " ").replace("(?%-", "").replace("-%?)", " ")
        current_answers.append(ans_clean)

    current_answers = current_answers[0].split(' ')
    del current_answers[-1]

    path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "user_tests", str(test.title_test), str(idx + 1)))
    if len(os.listdir(path)) > 0:
        name_img = os.listdir(path)[0]
    else:
        name_img = None
    index_img = idx + 1
    email=flask_login.current_user.email
    title=test.title_test
    if name_img:
        img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{idx + 1}/{name_img}")
    else:
        img_url = "not"

    emit("question", {
        "question": current_question,
        "answers": current_answers,
        "index": int(data_index["index"]) + 1,
        "amount_question": len(questions),
        "test_time": int(test_time),
        "type_question": type_question,
        "user_email": flask_login.current_user.email,
        "question_img": img_url if name_img else "not"
    })