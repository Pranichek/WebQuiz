from Project.socket_config import socket
import flask
from flask import session
from .models import Test
from flask_socketio import emit

@socket.on('connect')
def handle_connect():
    print('Client connected')
    test_id = flask.request.cookies.get("test_id")
    test = Test.query.get(int(test_id))
    test_time = test.question_time.split("?#?")
    # Получаем время первого вопроса
    question_index = int(flask.request.cookies.get("index_question"))
    time = test_time[question_index]

    emit("question", {
        "question": "Початок",
        "question": [],
        "answers": [],
        "test_time": int(time)
    })

@socket.on("get_question")
def handle_get_question(data_index):
    print("get question")
    if data_index and "index" in data_index:
        question_index = int(data_index["index"])
    else:
        question_index = int(flask.request.cookies.get("index_question"))

    
    test_id = flask.request.cookies.get("test_id")
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

    ['(?%+да+%?)(?%-нет-%?)']

        
    for ans in current_answers_list:
        ans_clean = ans.replace("(?%+", "").replace("+%?)", " ").replace("(?%-", "").replace("-%?)", " ")
        current_answers.append(ans_clean)


    current_answers = current_answers[0].split(' ')
    print(test_time.split(" ")[0], "vremya")
    del current_answers[-1]
    emit("question", {
        "question": current_question,
        "answers": current_answers,
        "index": question_index + 1,
        "amount_question": len(questions),
        "test_time": int(test_time)
    })


@socket.on("next_question")
def handle_next_question(data_index):
    print("next_question")
    test_id = flask.request.cookies.get("test_id")
    test = Test.query.get(int(test_id))
    questions = test.questions.split("?%?")
    answers_blocks = test.answers.split("?@?")

    idx = int(data_index["index"])
    print("Index:", idx)
    # Проверка на конец теста
    if idx >= len(questions):
        emit("question", {
            "question": "Кінець",
        })
        return

    current_question = questions[idx]
    current_answers_list = answers_blocks[idx].split("?@?")
    current_answers = []

    test_time = test.question_time.split("?#?")
    test_time = test_time[idx]

    for ans in current_answers_list:
        ans_clean = ans.replace("(?%+", "").replace("+%?)", " ").replace("(?%-", "").replace("-%?)", " ")
        current_answers.append(ans_clean)

    current_answers = current_answers[0].split(' ')
    del current_answers[-1]
    emit("question", {
        "question": current_question,
        "answers": current_answers,
        "index": int(data_index["index"]) + 1,
        "amount_question": len(questions),
        "test_time": int(test_time)
    })