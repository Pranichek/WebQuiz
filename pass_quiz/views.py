from flask import Flask, render_template, request
from flask_socketio import emit
from quiz import Test
from Project.socket_config import socket
from Project.login_check import login_decorate
from home.models import User
import flask_login
from Project.db import DATABASE
import pyperclip, flask_login

# @login_decorate
def render_finish_test():
    list_to_template = []
    if flask_login.current_user.is_authenticated:
        user : User = User.query.get(flask_login.current_user.id)
        email = user.email
        avatar = user.name_avatar


        if user.user_profile.percent_bonus >= 100:
            user.user_profile.percent_bonus = 0
            if user.user_profile.percent_bonus is not None:
                DATABASE.session.commit()
    else:
        user = flask_login.current_user
        email = None
        avatar = None

    return render_template(
        "test_finish.html",
        user = user,
        email = email,
        avatar = avatar,
        tests = list_to_template,
        finish_test = True
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

    
    count = 0
    answers = test.answers.split("?@?")
    correct_indexes = []
    list_final = []
    for question in questions:
        one_question = {}
        one_question["question"] = question
        list_answers = []
        for ans in answers:
            current_answers = []
            ans_clean = ans.replace("(?%+", "").replace("+%?)", "*|*|*").replace("(?%-", "").replace("-%?)", "*|*|*")
            current_answers.append(ans_clean)

            clear_answer = current_answers[0].split('*|*|*')
            if (clear_answer[-1] == ''):
                del clear_answer[-1]
            list_answers.append(clear_answer)
            

        one_question["answers"] = list_answers[count]
        list_final.append(one_question)
        count += 1

    #логика получение индекса правильного ответа даже если правильных несколько
    # например, если правильные ответы на вопрос 1 это да и нет, то в массиве будет [[0, 1], [тут индексі уже следующего вопроса и тд]]
    for index in range(len(questions)):
        current_answer_list = answers[index]
        data_str = ''
        for symbol in current_answer_list:
            if symbol == '+' or symbol == '-':
                data_str += symbol
        data_symbol = ['']
        
        symbol_list = []
        for i in range(0 ,len(data_str), 2):
            symbol_list.append(data_str[i:i+2]) 

        question_right_answers = []
        for i in range(len(symbol_list)):
            if symbol_list[i] == '++':
                question_right_answers.append(i)
        
        correct_indexes.append(question_right_answers)

    print(correct_indexes, "correct indexes")

    count_right_answers = 0

    list_users_answers = []
    if len(user_answers) > 0:
        for answers in user_answers:
            small_list = []
            list_users_answers.append(answers.split("@"))

    count_uncorrect_answers = 0
    count_answered = 0

    index_corect = []
    for i in range(len(user_answers)):
        if list_users_answers[i][0] != "skip":
            count_answered += 1
            if len(correct_indexes[i]) == 1:
                if int(correct_indexes[i][0]) == int(list_users_answers[i][0]):
                    count_right_answers += 1
                    index_corect.append(i)
                else:
                    count_uncorrect_answers += 1
            else:
                correct = 0
                uncorrect = 0
                for ans in list_users_answers[i]:
                    if int(ans) in correct_indexes[i]:
                        count_right_answers += 1
                        correct += 1
                    else:
                        # count_right_answers -= 1
                        count_uncorrect_answers += 1
                        uncorrect += 1
            
                if correct > len(correct_indexes[i]) / 2 and uncorrect == 0:
                    index_corect.append(i)


    # максимальное количество баллов
    amount_points = 0
    for index in correct_indexes:
        amount_points += len(index)
    accuracy = (count_right_answers / amount_points) * 100 if amount_points > 0 else 0

    # if flask_login.current_user.is_authenticated:
    #     users_passes = flask_login.current_user.user_profile.last_passed.split(" ")
    #     print("lololo", user_answers)
    #     last_id = users_passes[-1]
    #     user_answers[-1] = f"{last_id.split("/")[0]}/{int(accuracy)}"
    #     string_last_tests = " ".join(user_answers)
    #     print(user_answers, "kokok")
    #     flask_login.current_user.user_profile.last_passed = string_last_tests
    #     DATABASE.session.commit()

    mark = (12 * accuracy) // 100


    for indexList in range(len(list_users_answers)):
        for i in range(len(list_users_answers[indexList])):
            if list_users_answers[indexList][i] != "skip":
                list_users_answers[indexList][i] = int(list_users_answers[indexList][i])

    emit("test_result", {
        "amount_questions": amount_points,
        "right_answers": count_right_answers,
        "uncorrect_answers": count_uncorrect_answers,
        "accuracy": accuracy,
        "questions": list_final,
        "test_id": test_id,
        "mark": mark,
        "count_answered": count_answered,
        "correct_index": index_corect,
        "users_answers": list_users_answers,
        "correct_answers": correct_indexes
    })

@socket.on("copy_result")
def coput_result_function(data):    
    test_id = int(data["test_id"])
    test : Test = Test.query.get(test_id)

    test_question = test.questions.split("?%?")
    count_questions_test = len(test_question)
    
    test_text = "📋 Результати мого тесту:\n🧪 Назва тесту: {}\n✅ Правильних відповідей: {} з {}\n📈 Результат: {}\n⏱ Час проходження: {}".format(
                                                                                                                                test.title_test,
                                                                                                                                data["correct_answers"],
                                                                                                                                count_questions_test,
                                                                                                                                data["accuracy"],
                                                                                                                                data["wasted_time"]
                                                                                                                            )

    pyperclip.copy(test_text)

@socket.on("fav-test")
def add_fav_test(data):    
    test_id = str(data["test_id"])
    user = flask_login.current_user
    fav_tests = user.user_profile.fav_tests or ""
    fav_tests_list = fav_tests.strip().split()

    if test_id not in fav_tests_list:
        fav_tests_list.append(test_id)  

        user.user_profile.fav_tests = " ".join(fav_tests_list) + " "

        DATABASE.session.commit()

