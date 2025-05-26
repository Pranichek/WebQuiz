from Project.socket_config import socket
import flask
from flask import session
from .models import Test
from flask_socketio import emit

@socket.on('connect')
def handle_connect():
    print('Client connected')
    emit("question", {
        "question": "Початок",
        "question": [],
        "answers": [],
    })

@socket.on("get_question")
def handle_get_question():
    print("Clear")
    flask.session["question_index"] = 0  
    
    test_id = flask.request.cookies.get("test_id")
    test = Test.query.get(int(test_id))
    questions = test.questions.split("?%?")
    answers_blocks = test.answers.split("?@?")

    session["question_index"] = 0

    idx = session["question_index"]
    current_question = questions[idx]

    # Получаем варианты ответов и убираем маркеры
    current_answers_list = answers_blocks[idx].split("?@?")
    current_answers = []

    ['(?%+да+%?)(?%-нет-%?)']

        
    for ans in current_answers_list:
        ans_clean = ans.replace("(?%+", "").replace("+%?)", " ").replace("(?%-", "").replace("-%?)", " ")
        current_answers.append(ans_clean)


    current_answers = current_answers[0].split(' ')
    del current_answers[-1]
    emit("question", {
        "question": current_question,
        "answers": current_answers,
        "index": flask.session["question_index"] + 1
    })


@socket.on("next_question")
def handle_next_question():
    print("suka")
    test_id = flask.request.cookies.get("test_id")
    test = Test.query.get(int(test_id))
    questions = test.questions.split("?%?")
    answers_blocks = test.answers.split("?@?")

    idx = int(flask.session["question_index"]) + 1

    # Проверка на конец теста
    if idx >= len(questions):
        emit("question", {
            "question": "Кінець",
        })
        return

    session["question_index"] = idx

    current_question = questions[idx]
    current_answers_list = answers_blocks[idx].split("?@?")
    current_answers = []

    for ans in current_answers_list:
        ans_clean = ans.replace("(?%+", "").replace("+%?)", " ").replace("(?%-", "").replace("-%?)", " ")
        current_answers.append(ans_clean)

    current_answers = current_answers[0].split(' ')
    del current_answers[-1]

    emit("question", {
        "question": current_question,
        "answers": current_answers,
        "index": flask.session["question_index"] + 1
    })
