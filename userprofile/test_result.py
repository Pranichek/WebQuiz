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
    print(user_answers, "dfv")

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

    count_right_answers = 0


    old_data = flask_login.current_user.user_profile.last_passed #" 2"
    
    indexes = old_data.split(" ") # [" ", "2"]
    if indexes[0] == "" or indexes[0] == " ":
        indexes.pop(0)# ["2/0,1", "2/0,1", "2"]

    for el in indexes:

        if int(el.split("/")[0]) == int(test_id) and len(el.split("/")) == 1:

            current_index = indexes.index(el)
            formatted_answers = ",".join(user_answers)
            indexes[current_index] = f"{test_id}/{formatted_answers}"

    flask_login.current_user.user_profile.last_passed = " ".join(indexes)
    DATABASE.session.commit()

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

    mark = (12 * accuracy) // 100


    for indexList in range(len(list_users_answers)):
        for i in range(len(list_users_answers[indexList])):
            if list_users_answers[indexList][i] != "skip":
                list_users_answers[indexList][i] = int(list_users_answers[indexList][i])

    socket.emit("test_result_profile", {
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

@socket.on("add_favorite")
def save_favorite(data: dict):
    user : User = flask_login.current_user
    test_id = data["test_id"]
    all_favorites = user.user_profile.favorite_tests.split()

    if test_id not in all_favorites:
        all_favorites.append(test_id)
       
        user.user_profile.favorite_tests = " ".join(all_favorites)
        DATABASE.session.commit()
