from flask import Flask, render_template, request
from flask_socketio import emit
from quiz import Test
from Project.socket_config import socket
from Project.login_check import login_decorate
from home.models import User
import flask_login
from Project.login_check import login_decorate

@login_decorate
def render_finish_test():
    user = User.query.get(flask_login.current_user.id)
    email = user.email
    avatar = user.name_avatar

    return render_template(
        "test_finish.html",
        user = user,
        email = email,
        avatar = avatar,
        )

@socket.on("finish_test")
def handle_finish_test(data):

    user_answers_raw = data.get("users_answers")
    if user_answers_raw == '':
        user_answers_raw = 'skip'

    test_id = data.get("test_id")

    user_answers = user_answers_raw.split(",")
    test = Test.query.get(int(test_id))
    
    questions = test.questions.split("?%?")
    answers = test.answers.split("?@?")
    correct_indexes = []

    user_answers = user_answers_raw.split(",")


    questions = test.questions.split("?%?")
    print("vvvvvvvvvv")
    print(questions)
    print("aaaaaaaaaa")
    print(test.answers)
    
    count = 0
    answers = test.answers.split("?@?")
    correct_indexes = []
    list_final = []
    for question in questions:
        one_question = {}
        one_question["question"] = question
        list_answers = []
        for answer in answers:
            answer = answer.replace("(?%", "")
            answer = answer.replace("%?)", "")
            answer = answer[1:-1]
            answer = answer.split("+-")
            print("-------------------")
            print(answer)
            list_answers.append(answer)
        

        one_question["answers"] = list_answers[count]
        list_final.append(one_question)
        count += 1
    for answer_string in answers:
        data_str = ''.join([s for s in answer_string if s in "+-"])
        symbol_list = [data_str[i:i+2] for i in range(0, len(data_str), 2)]

        question_right_answers = [i for i, sym in enumerate(symbol_list) if sym == '++']
        correct_indexes.append(question_right_answers)

    count_right_answers = 0
    list_users_answers = [ans.split("@") for ans in user_answers]

    for i in range(min(len(correct_indexes), len(list_users_answers))):
        user_ans = list_users_answers[i]
        if user_ans[0] == "skip":
            continue
        if len(correct_indexes[i]) == 1:
            if int(correct_indexes[i][0]) == int(user_ans[0]):
                count_right_answers += 1
        else:
            for ans in user_ans:
                if int(ans) in correct_indexes[i]:
                    count_right_answers += 1

    amount_points = sum(len(indexes) for indexes in correct_indexes)
    accuracy = (count_right_answers / amount_points) * 100 if amount_points > 0 else 0
    print("fffffffff")
    print(list_final)
    emit("test_result", {
        "amount_questions": amount_points,
        "right_answers": count_right_answers,
        "accuracy": accuracy,
        "questions": list_final 
    })


