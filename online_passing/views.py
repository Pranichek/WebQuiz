import flask, flask_login, qrcode, os
from Project.login_check import login_decorate
from os.path import exists, abspath, join
from Project.socket_config import socket
from flask_login import current_user
from .del_files import delete_files_in_folder
from Project.db import DATABASE

@login_decorate
def render_mentor():
    # отримуємо код кімнати з параметрів запиту
    code = flask.request.args.get("room_code")
    # зберігаємо об'єкт користувача в змінну
    user = flask_login.current_user

    # qrcode - 
    # Створюємо QR-код(об'єкт) з посиланням на кімнату
    qr = qrcode.QRCode(
        # корекцыя помилок - висока
        error_correction = qrcode.constants.ERROR_CORRECT_H, 
        # розмір qrcode
        box_size = 15,
        # розмір рамки навколо qrcode
        border = 2
    )
    # задаємо посилання на яке буде вести QR-код
    qr.add_data(f"http://127.0.0.1:5000/student?room_code={code}")
    # створюємо QR-код, але у вигляді закодовоного коду
    qr.make(fit = True)

    # створюємо зображення QR-коду
    image = qr.make_image(
        # кольори QR-коду
        fill_color = '#000000',
        # колір фону QR-коду
        back_color = "#ffffff",
    )

    # зберігаємо зображення QR-коду в папку користувача
    if not exists(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "qrcodes"))):
        os.makedirs(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "qrcodes")))
    if not os.path.exists(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "qrcodes", f"{code}.png"))):
        delete_files_in_folder(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "qrcodes")))
        with open((abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "qrcodes", "chat.json"))), "w") as f:
            f.write("")

    image.save(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "qrcodes", f"{code}.png")))
    
    

    if flask.request.method == "POST":
        socket.emit()

    return flask.render_template(
        "mentor.html",
        mentor = True,
        code = code,
        user = user
    )


@login_decorate
def render_student():
    current_user.user_profile.count_points = 0
    DATABASE.session.commit()

    return flask.render_template(
        "student.html",
        user = flask_login.current_user
    )

@socket.on("finish_test")
def handle_finish_test(data: dict):
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

    raw_type = DATABASE.session.query(Test.type_questions).filter_by(id=test_id).first()
    # types_quest = []
    for el in raw_type:
        types_quest = el.split("?$?")
        # types_quest.append(a)
    
    

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
            if len(correct_indexes[i]) == 1 and list_users_answers[i][0].isdigit():
                if int(correct_indexes[i][0]) == int(list_users_answers[i][0]):
                    count_right_answers += 1
                    index_corect.append(i)
                else:
                    count_uncorrect_answers += 1
            elif list_users_answers[i][0].isdigit():
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
            else:
                user_answer_value = list_users_answers[i][0]
                correct_answer_values = [answers[idx].replace("(?%+", "").replace("+%?)", "").replace("(?%-", "").replace("-%?)", "") for idx in correct_indexes[i] if idx < len(answers)]
                if user_answer_value in correct_answer_values:
                    count_right_answers += 1
                    index_corect.append(i)
                else:
                    count_uncorrect_answers += 1


    # максимальное количество баллов
    amount_points = 0
    for index in correct_indexes:
        amount_points += len(index)
    accuracy = (count_right_answers / amount_points) * 100 if amount_points > 0 else 0

    mark = (12 * accuracy) // 100


    for indexList in range(len(list_users_answers)):
        for i in range(len(list_users_answers[indexList])):
            if list_users_answers[indexList][i] != "skip":
                if list_users_answers[indexList][i].isdigit():
                    list_users_answers[indexList][i] = int(list_users_answers[indexList][i])
                else:
                    list_users_answers[indexList][i] = list_users_answers[i][0]


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

    emit("test_result", {
        "right_answers": count_right_answers,
        "uncorrect_answers": count_uncorrect_answers,
        "accuracy": accuracy,
    })