import flask, flask_login
from Project.socket_config import socket
from quiz.models import Test
from Project.db import DATABASE
from flask_socketio import emit
from Project.login_check import login_decorate
from home.models import User

@login_decorate
def render_test_result():

    return flask.render_template(
        "test_result.html",
        user = flask_login.current_user
    )

@socket.on("test_result")
def get_data(data):
    test_id = data["test_id"]
    test = Test.query.get(int(test_id))
    
    questions = test.questions.split("?%?")
    answers = test.answers.split("?@?")
    correct_indexes = []

    user_answers = data["user_answers"].split(",")

    types_questions = test.type_questions.split("?$?")
    questions = test.questions.split("?%?")
    answers = test.answers.split("?@?")

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


    count_right_answers = 0


    list_users_answers = []
    if len(user_answers) > 0:
        for answers in user_answers:
            small_list = []
            list_users_answers.append(answers.split("@"))  

    print(list_users_answers, "lolka")


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


    answered_questions = test.answers.count("?@?") + 1   # сколько вопросов уже пройдено
    accuracy = (right_answers  / answered_questions) * 100 if answered_questions > 0 else 0

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
                indexes[current_index] = f"{test_id}/{formatted_answers}/{average_time}/{accuracy}"

        flask_login.current_user.user_profile.last_passed = " ".join(indexes)
        DATABASE.session.commit()

    emit("test_result_profile", {
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
        "type_question": types_quest
    })


@socket.on("add_favorite")
def save_favorite(data: dict):
    user : User = flask_login.current_user
    test_id = data["test_id"]
    all_favorites = user.user_profile.favorite_tests.split()

    if test_id not in all_favorites:
        all_favorites.append(test_id)
       
        user.user_profile.favorite_tests = " ".join(all_favorites)
        DATABASE.session.commit()
