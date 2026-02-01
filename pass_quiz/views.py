'''
Обробка кінця тесту
'''

import flask_login, flask, os
from flask import render_template
from flask_socketio import emit
from quiz import Test
from Project.socket_config import socket
from Project.login_check import login_decorate
from home.models import User
from Project.db import DATABASE
import pyperclip, flask_login
from os.path import abspath, join, exists
from .correct_answers import return_answers




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
        finish_test = True,
        check_auth = True if not flask_login.current_user.is_authenticated else False
        )


def render_questions():

    return render_template(
        "questions.html"
        )


@socket.on("finish_test")
def handle_finish_test(data: dict):
    user_answers_raw = data.get("users_answers")
    test_id = data.get("test_id")

    if user_answers_raw == '':
        user_answers_raw = "∅"

    
    user_answers = user_answers_raw.split(",") 
    test : Test = Test.query.get(int(test_id))
    
    types_questions = test.type_questions.split("?$?")
    questions = test.questions.split("?%?")
    answers = test.answers.split("?@?")

    if len(user_answers) > len(types_questions):
        del user_answers[-1]

    for index in range(len(user_answers)):
        if types_questions[index] == "input-gap":
            wait_res = user_answers[index].split()
            user_answers[index] = "¤".join(wait_res)
    

    # список где хранятся праивльные индексы либо строчные ответы на вопрос
    correct_indexes = []


    raw_type = DATABASE.session.query(Test.type_questions).filter_by(id=test_id).first()
    # types_quest = []
    for el in raw_type:
        types_quest = el.split("?$?")
        # types_quest.append(a)
    
    
    # 
    count = 0
    answers = test.answers.split("?@?")
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
        correct_answers = return_answers(index= index, test_id= int(test_id))
        
        correct_indexes.append(correct_answers)


    count_right_answers = 0


    list_users_answers = []
    if len(user_answers) > 0:
        for answers in user_answers:
            small_list = []
            list_users_answers.append(answers.split("@")) 

    # если юзер ответил не на все вопросі
    if len(list_users_answers) < len(questions):
        while len(list_users_answers) < len(questions):
            list_users_answers.append(["∅"])



    count_uncorrect_answers = 0
    count_answered = 0

    index_corect = []
    types = test.type_questions.split("?$?")

    # счеткички сколько именно правильных а сколько нет
    right_answers = 0
    uncorrect_answers = 0

    for i in range(len(user_answers)):
        if list_users_answers[i][0] != "∅":
            count_answered += 1
            if types[i] == "one-answer":
                if int(correct_indexes[i][0]) == int(list_users_answers[i][0]):
                    count_right_answers += 1
                    index_corect.append(i)
                    right_answers += 1
                else:
                    count_uncorrect_answers += 1
                    uncorrect_answers += 1

            elif types[i] == "many-answers":
                correct = 0
                uncorrect = 0
                for ans in list_users_answers[i]:
                    if int(ans) in correct_indexes[i]:
                        count_right_answers += 1
                        correct += 1
                    else:
                        count_uncorrect_answers += 1
                        uncorrect += 1
                
                # расчитіваем сколько минимум должно біть правильніх ответов чтобы засчитать бал
                count_min = len(correct_indexes[i]) / 2 

                if correct > int(count_min) and uncorrect == 0:
                    right_answers += 1
                else:
                    uncorrect_answers += 1
                if correct > len(correct_indexes[i]) / 2 and uncorrect == 0:
                    index_corect.append(i)

            elif types[i] == "input-gap":
                user_answer_value = list_users_answers[i][0]
                answers_gaps = test.answers.split("?@?")[i].split("+%?)")
                if "" in answers_gaps:
                    answers_gaps.remove("")
                new_answers = []
                for answer in answers_gaps:
                    answer = answer.replace("(?%+", "").replace("+%?)", "")
                    new_answers.append(answer)

                if user_answer_value in new_answers:
                    count_right_answers += 1
                    index_corect.append(i)
                    right_answers += 1
                else:
                    count_uncorrect_answers += 1
                    uncorrect_answers += 1

    flask.session["count_answered"] = count_answered

    answered_questions = test.answers.count("?@?") + 1   # сколько вопросов уже пройдено
    accuracy = (right_answers  / answered_questions) * 100 if answered_questions > 0 else 0

    last_accuracy = flask_login.current_user.user_profile.last_answered.split("𒀱")
    if int(float(last_accuracy[1])) != int(accuracy):
        last_accuracy[1] = int(accuracy)
        flask_login.current_user.user_profile.last_answered = "𒀱".join(map(str, last_accuracy))
        DATABASE.session.commit()

    mark = (12 * accuracy) // 100


    for indexList in range(len(list_users_answers)):
        for i in range(len(list_users_answers[indexList])):
            if list_users_answers[indexList][i] != "∅":
                if types[indexList] == "many-answers" or types[indexList] == "one-answer":
                    list_users_answers[indexList][i] = int(list_users_answers[indexList][i])
                elif types[indexList] == "input-gap":
                    list_users_answers[indexList][i] = user_answers[indexList]

    if flask_login.current_user.is_authenticated:
        old_data = flask_login.current_user.user_profile.last_passed #" 2"
        indexes = old_data.split(" ") # [" ", "2"]
        if indexes[0] == "" or indexes[0] == " ":
            indexes.pop(0)# 

        for el in indexes:
            if int(el.split("/")[0]) == int(test_id) and len(el.split("/")) == 1:
                current_index = indexes.index(el)
                formatted_answers = ",".join(user_answers)
                average_time = int(int(data["wasted_time"]) / count_answered) if count_answered != 0 else 0

                indexes[current_index] = f"{test_id}/{formatted_answers}/{average_time}/{int(accuracy)}"

        flask_login.current_user.user_profile.last_passed = " ".join(indexes)
        DATABASE.session.commit()


    # получение картинок к тесту(и к вопросу и к ответу)
    img_lists = []
    count_questions = test.questions.count("?%?") + 1
    for index in range(count_questions):
        small_list = ["not" for index in range(len(list_final[index]["answers"]) + 1)]

        check_img = False

        path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(test.user.email), "user_tests", str(test.title_test), str(index + 1)))
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
            img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index + 1}/{name_img}")
        else:
            img_url = "not"

        small_list[0] = img_url
        # check the images for answers(tipo lol)

        range_len = len(list_final[index]["answers"]) + 1
        for index_answ in range(1, range_len):
            path = abspath(join(__file__, "..", "..", 
                    "userprofile", "static", "images", "edit_avatar", 
                    str(test.user.email), "user_tests", str(test.title_test), 
                    str(index + 1), str(index_answ)))
            
            if exists(path):                
                answer_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index + 1}/{index_answ}/{os.listdir(path)[0]}")

                small_list[index_answ] = answer_url

        img_lists.append(small_list)

    
    emit("test_result", {
        "amount_questions": test.answers.count("?@?") + 1,
        "right_answers": right_answers,
        "uncorrect_answers": uncorrect_answers,
        "accuracy": accuracy,
        "questions": list_final,
        "test_id": test_id,
        "mark": mark,
        "count_answered": count_answered,
        "correct_index": index_corect,
        "users_answers": list_users_answers,
        "correct_answers": correct_indexes,
        "type_question": types_quest,
        "images": img_lists
    })

@socket.on("save_time")
def save_time(data):
    if str(flask_login.current_user.user_profile.avarage_time) != str(data["midle_time"]):
        print(int(data["midle_time"]), int(flask.session["count_answered"]), 'lols')
        flask_login.current_user.user_profile.avarage_time = int(data["midle_time"]) // int(flask.session["count_answered"])
        DATABASE.session.commit()



@socket.on("copy_result")
def coput_result_function(data: dict):    
    test_id = int(data["test_id"])
    test : Test = Test.query.get(test_id)

    test_question = test.questions.split("?%?")
    count_questions_test = len(test_question)
    
    test_text = "📋 Результати проходження тесту:\n" \
                "📖 Назва тесту: {}\n" \
                "✔️ Правильних відповідей: {} з {}\n" \
                "📊 Точність: {}%\n" \
                "🎯 Оцінка: {}\n" \
                "⏱️ Час проходження: {} сек".format(
                    test.title_test,
                    data["correct_answers"],
                    count_questions_test,
                    round(float(data["accuracy"])),
                    data["mark"],
                    data["wasted_time"]
                )

    pyperclip.copy(test_text)




@socket.on("add_favorite")
def save_favorite(data: dict):
    if flask_login.current_user.is_authenticated:
        user : User = flask_login.current_user
        test_id = data["test_id"]
        all_favorites = user.user_profile.favorite_tests.split()

        if test_id not in all_favorites:
            all_favorites.append(test_id)
        
            user.user_profile.favorite_tests = " ".join(all_favorites)
            DATABASE.session.commit()

            emit("add")
    else:
        emit("didn't add")