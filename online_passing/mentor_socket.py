import flask, flask_login, os
from Project.socket_config import socket
from quiz.models import Test
from .models import Rooms, TestResult
from home.models import User
from flask_socketio import emit
from Project.db import DATABASE
from operator import itemgetter
from os.path import exists, join, abspath
from userprofile.models import DataUser
from .correct_answers import return_answers



@socket.on("users_results")
def users_results(data):
    user_list = []
    room : Rooms = Rooms.query.filter_by(room_code= data["room"]).first()
    room.status = "result"
    user_ids = room.users if room and room.users else []


    test : Test = Test.query.get(int(room.id_test))
    index_question = int(data["index_question"])
    text_question = test.questions.split("?%?")[index_question]
    type_question = test.type_questions.split('?$?')[index_question]

    # print(index_question, "perec_ed")

    answers = test.answers.split("?@?")[index_question]
    clear_answers = None
    ans_clean = answers.replace("(?%+", "").replace("+%?)", "*|*|*").replace("(?%-", "").replace("-%?)", "*|*|*")
    clear_answers = ans_clean.split('*|*|*')
    if "" in clear_answers:
        clear_answers.remove("")

    # сохраняем варианы ответа с + либо -, взависимости от того правильный ответ или нет
    unclear_answers = answers.replace("(?%", "").replace("%?)", "*|*|*").replace("(?%", "").replace("%?)", "*|*|*")
    unclear_ready = unclear_answers.split("*|*|*")
    unclear_ready.remove("")#['-8-', '+6+', '-10-', '-да-'] 
    right_indexes = []

    count = 0
    for answer in unclear_ready:
        if answer[0] == "+":
            right_indexes.append(count)
        count += 1

    avarage_accuracy = 0
    count_people = 0
    
    if type_question != "input-gap":
        count_people_answes = []
        for answer in clear_answers:
            count_people_answes.append(0)
    else:
        count_people_answes = [0, 0]

    if type_question != "input-gap":
        count = 0
        count_image = 1
        for answer in clear_answers:
            if answer == "image?#$?image":
                clear_answers[count] = f"зображення   {count_image}"
                count_image += 1
            count+=1


    # count_people = 1 if count_people <= 0 else count_people

    count_correct = 0
    count_uncorrect = 0
    count_skip = 0

    # for dots diagram
    students_answer = []

    for user in user_ids:
        # user : User  = User.query.get(int(user_id))
        user.user_profile.answering_answer = "відповідає"
        DATABASE.session.commit()
        if user and user.id != flask_login.current_user.id:
            avatar_url = flask.url_for('profile.static', filename=f'images/edit_avatar/{user.name_avatar}')
            
            count = 0
            count_image = 1
            users_answers = user.user_profile.last_answered.split("𒀱")[0].split()
            for user_answer in users_answers:
                if type_question != "input-gap":
                    if user_answer == "image?#$?image":
                        users_answers[count] = f"зображення"
                        count_image+=1

                    users_answers[count] = f"{count+1}){users_answers[count]}"
                    count+=1

            students_answer.append({
                "name":user.username,
                "percent": int(float(user.user_profile.last_answered.split("𒀱")[1]))
                })

            user_list.append({
                "username": user.username,
                "email": user.email,
                "ready": user.user_profile.answering_answer,
                "points": user.user_profile.count_points,
                "user_avatar": avatar_url,
                "avatar_size": user.size_avatar,
                "last_answer": users_answers,
                "accuracy": user.user_profile.last_answered.split("𒀱")[1],
                "right_wrong": user.user_profile.last_answered.split("𒀱")[2],
                "input_answer":  user.user_profile.last_answered.split("𒀱")[0],
                "id":user.id
            })

            if int(user.user_profile.last_answered.split("𒀱")[2]) == 1:
                count_correct += 1
                avarage_accuracy += 100
            elif int(user.user_profile.last_answered.split("𒀱")[2]) == 0:
                count_uncorrect += 1
            else:
                count_skip += 1

            
            count_people += 1

            if type_question != "input-gap":
                answers = user.user_profile.last_answered.split("𒀱")[3].split("@")
                for answer in answers:
                    if answer != '∅':
                        if int(answer) == 0:
                            count_people_answes[0] = count_people_answes[0]+1
                        elif int(answer) == 1:
                            count_people_answes[1] = count_people_answes[1]+1
                        elif int(answer) == 2:
                            count_people_answes[2] = count_people_answes[2]+1
                        else:
                            count_people_answes[3] = count_people_answes[3]+1
            else:
                answer = user.user_profile.last_answered.split("𒀱")[3].split("@")

                if str(answer[0]) in clear_answers:
                    count_people_answes[0] = count_people_answes[0]+1
                else:
                    count_people_answes[1] = count_people_answes[1]+1


    # проверка на лучший вопрос
    avarage_accuracy = avarage_accuracy // count_people
    best_question = room.best_question
    worst_question = room.worst_question

    all_procents = room.all_questions.split(" ") if room.all_questions is not "" else []
    data_questions = room.data_question.split(" ") if room.data_question is not "" else []
    # Убедимся, что записываем строку, или полагаемся на map(str, ...) ниже

    if index_question != len(all_procents) - 1 or len(all_procents) == 0:
        all_procents.append(str(avarage_accuracy)) 
        data_questions.append(f"{count_correct}/{count_uncorrect}/{count_skip}")

    room.all_questions = " ".join(all_procents)
    room.data_question = " ".join(data_questions)
    DATABASE.session.commit()

    if best_question is None:
        room.best_question = f"{avarage_accuracy} {index_question}"
        room.worst_question = f"{avarage_accuracy} {index_question}"
        DATABASE.session.commit()

    else:
        best_question = room.best_question.split(" ")
        if int(avarage_accuracy) > int(best_question[0]):
            room.best_question = f"{avarage_accuracy} {index_question}"

        if int(avarage_accuracy) < int(worst_question.split(" ")[0]):
            room.worst_question = f"{avarage_accuracy} {index_question}"

        DATABASE.session.commit()

    # черещ встроенній модуль делаем филтрацию словаря за "count_points" и делаем реверс чтобі біло от большего к меньшему
    user_list = sorted(user_list, key=itemgetter("points"), reverse=True)

    # была ли картинка к вопросу
    path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(test.user.email), "user_tests", str(test.title_test), str(index_question + 1)))
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
    img_url = "not"

    if name_img:
        img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index_question + 1}/{name_img}")
    # numbers questions
    num_questions = [index + 1 for index in range(len(test.questions.split("?%?")))]

    emit("list_results", {
        "count_questions": len(test.questions.split("?%?")),
        "avarage_accuracy": avarage_accuracy,
        "users": user_list, 
        "answers": clear_answers, 
        "count_answers":count_people_answes, 
        "type_question": type_question, 
        "text_question":text_question,
        "image_url":img_url,
        "right_indexes": right_indexes,
        "answer_options": answers if type_question != "input-gap" else answers.replace("(?%+", "").replace("+%?)", " ").split(),
        "questions":  num_questions,
        "accuracy_questions":all_procents,
        "students_procents": students_answer
    })


@socket.on("load_question")
def load_question_mentor(data):
    user_list = []
    room: Rooms = Rooms.query.filter_by(room_code= data["room"]).first()
    user_ids = room.users if room and room.users else []

    for user in user_ids:
        if user and user.id != flask_login.current_user.id:

            user_list.append({
                "username": user.username,
                "ready": user.user_profile.answering_answer,
                "count_points": user.user_profile.count_points,
                "id": user.id,
                "accuracy": user.user_profile.last_answered.split("𒀱")[1],
                "right_wrong": user.user_profile.last_answered.split("𒀱")[2]
            })

    user_list.sort(key=lambda x: x['accuracy'], reverse=True)
    user_list.sort(key=lambda x: x['count_points'], reverse=True)

    test : Test = Test.query.get(room.id_test)

    index_question = int(data["index"])
    text_question = test.questions.split("?%?")[index_question]
    type_question = test.type_questions.split('?$?')[index_question]
    time_question = test.question_time.split("?#?")[index_question]
    answer_options = test.answers.split("?@?")[index_question]

    path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(test.user.email), "user_tests", str(test.title_test), str(index_question + 1)))
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
        img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index_question + 1}/{name_img}")
    else:
        img_url = "not"

    # проверка на то что есть ли в ответах картинки или нет
    image_urls = ["none", "none", "none", "none"]
    if exists(path):
        for index in range(1, 5):
            current_path = join(path, str(index))
            if exists(current_path) and len(os.listdir(current_path)) > 0:
                url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index_question + 1}/{str(index)}/{os.listdir(current_path)[0]}")
                image_urls[index - 1] = url
    

    emit("data_question_mentor", {
        "user_list": user_list,
        "text_question": text_question,
        "type_question": type_question,
        "time_question": time_question,
        "answer_options": answer_options if type_question != "input-gap" else answer_options.replace("(?%+", "").replace("+%?)", " ").split(),
        "img_url": img_url,
        "image_urls": image_urls,
        "amount_question": len(test.questions.split("?%?"))
    })
    emit("update_users", {"user_list": user_list})

    room.status = "started"
    room.index_question = int(index_question)
    DATABASE.session.commit()

@socket.on("check_users")
def check_users(data):
    room : Rooms = Rooms.query.filter_by(room_code = data["room_code"]).first()
    check_room = []
    if data["page"] == "finish_test":
        check_room = room.users_results.all() if room else []
    else:
        check_room = room.users

    users = room.users
    for user in users:
        # user : User = User.query.get(int(id))

        if str(user.user_profile.index_question) != str(data["index_question"]):
            user.user_profile.last_answered = "пропустив𒀱0.0𒀱2𒀱∅"
            user.user_profile.index_question = str(data["index_question"])
            DATABASE.session.commit()
            user_list = []
            user_ids = room.users if room and room.users else []

            for user in user_ids:
                # user : User  = User.query.get(int(user_id))
                if user and user.id != flask_login.current_user.id:


                    user_list.append({
                        "username": user.username,
                        "ready": user.user_profile.answering_answer,
                        "count_points": user.user_profile.count_points,
                        "id": user.id
                    })
            emit("update_users", {"user_list": user_list})

    if len(check_room) != len(room.users):
        if data["page"] == "passing":
            emit("check_connect", {"page": "start_passing", "index_question": data["index_question"]}, room = data["room_code"])
        elif data["page"] == "result":
            emit("check_connect", {"page": "result", "index_question":data["index_question"]}, room = data["room_code"])
        elif data["page"] == "finish_test":
            emit("check_connect", {"page": "finsh_test", "index_question":data["index_question"]}, room = data["room_code"])


@socket.on("end_time")
def no_time(data):
    room_code = data["room"]

    emit("no_time", {"index_question": data["index"]}, room=room_code, broadcast=True)

@socket.on("next_one")
def next_question(data):
    index_question = int(data["index"])
    test_id = int(data["test_id"])
    room_code = data["room"]
    room : Rooms = Rooms.query.filter_by(room_code=room_code).first()

    test : Test = Test.query.get(room.id_test)
    if index_question  > test.questions.count("?%?"):
        emit("end_test", {"status": "ok"}, room=room_code, broadcast=True)
    else:
        emit("next_question", {"index_question": data["index"]}, room=room_code, broadcast=True)
        room.sockets_users.clear()
        DATABASE.session.commit()


@socket.on("add_time")
def add_time(data):
    emit("add_some_time", room=data["code"], broadcast= True)

@socket.on("stopTime")
def stop_time(data):
    room_code = data["code"]
    emit("stop_time", room = room_code, include_self=True)


@socket.on("finish_mentor")
def finish_test(data):
    user_list = []
    room : Rooms = Rooms.query.filter_by(room_code= data["room"]).first()
    room.status = "finish"
    test : Test = Test.query.get(int(data["test_id"]))

    # одразу зберігаємо результати усіх користувачів
    if room.users_results.count() == 0:
        user_ids = room.users if room and room.users else []
        
        for user in user_ids:
            if user.id == room.user_id:
                continue
                
            profile : DataUser = user.user_profile 

            all_procents = profile.all_procents.split()
            sum_prcoents = sum(int(x) for x in all_procents)
            accuracy = int(profile.all_procents.split()[-1]) if len(profile.all_procents.split()) > 0 else 0
            
            mark = (12 * accuracy) // 100
            
            model_result = TestResult(
                user_id=user.id,
                mark = mark,
                user_answers=profile.all_answers,
                all_procents=profile.all_procents,
                avarage_time=profile.avarage_time,
                accuracy = accuracy,
                count_points = profile.count_points,
                username = profile.user.username,
                email = profile.user.email
            )
            
            room.users_results.append(model_result)
            
            DATABASE.session.add(model_result)
            
        DATABASE.session.commit()

    user_ids = room.users_results.all() if room else []

    accuracy_result = [] #[[80, 5],[50, 1]] - пример что в нем будет хранится(80 - это проценты, 5 - колво людей что прошло на такой результат)
    sum_accuracy = 0
    passed_test = 0
    total_accuracy = 0

    stats_bins = {
        '<40%': 0,
        '40-59%': 0,
        '60-79%': 0,
        '80-99%': 0,
        '100%': 0
    }

    correct_indexes = []

    questions = test.questions.split("?%?")

    for index in range(len(questions)):
        correct_answers = return_answers(index= index, test_id= int(int(data["test_id"])))
        
        correct_indexes.append(correct_answers)

        

    for user in user_ids:
        
        if user:
            
            list_check = []
                
            user_answers = user.user_answers.split("?#$?")
            types = test.type_questions.split("?$?")
            # print(user_answers, "lol")
            if '' == user_answers[-1]:
                del user_answers[-1]
            # print(user.all_procents)
            for i in range(len(user_answers)):
                if len(correct_indexes[i]) > 0:
                    if user_answers[i] != "∅":
                        if types[i] == "one-answer":
                            if int(correct_indexes[i][0]) == int(user_answers[i]):
                                list_check.append("правильно")
                            else:
                                list_check.append("неправильно")

                        elif types[i] == "many-answers":
                            correct = 0
                            uncorrect = 0
                            list_answs = user_answers[i].split("@")

                            for ans in list_answs:
                                if int(ans) in correct_indexes[i]:
                                    correct += 1
                                else:
                                    uncorrect += 1
                            
                            # расчитіваем сколько минимум должно біть правильніх ответов чтобы засчитать бал
                            count_min = len(correct_indexes[i]) / 2 

                            if correct > int(count_min) and uncorrect == 0:
                                list_check.append("правильно")
                            else:
                                list_check.append("неправильно")

                        elif types[i] == "input-gap":
                            user_answer_value = user_answers[i]
                            answers_gaps = test.answers.split("?@?")[i].split("+%?)")
                            if "" in answers_gaps:
                                answers_gaps.remove("")
                            new_answers = []
                            for answer in answers_gaps:
                                answer = answer.replace("(?%+", "").replace("+%?)", "")
                                new_answers.append(answer)

                            if user_answer_value in new_answers:
                                list_check.append("правильно")
                            else:
                                list_check.append("неправильно")
                    else:
                        # не ответил
                        list_check.append("пропустив")
                else:
                    if user_answers[i] != "∅":
                        list_check.append("правильно")
                    else:
                        list_check.append("пропустив")

            user_list.append({
                "id": user.user_id,
                "username": user.username,
                "email": user.email,
                "count_points": user.count_points,
                "accuracy": int(user.all_procents.split()[-1]) if len(user.all_procents.split()) > 0 else 0,
                "user_answers": list_check
            })

            accuracy = int(user.all_procents.split()[-1]) if len(user.all_procents.split()) > 0 else 0
            check = False

            for elem in accuracy_result:
                if elem[0] == accuracy:
                    # [80, 5]
                    check = True
                    elem[1] += 1
                    sum_accuracy += accuracy
                    
                    break
                
            if check == False:
                new_list = [accuracy, 1]
                sum_accuracy += accuracy

                accuracy_result.append(new_list)
            passed_test += 1
            total_accuracy += accuracy

            if accuracy < 40:
                stats_bins['<40%'] += 1
            elif 40 <= accuracy <= 59:
                stats_bins['40-59%'] += 1
            elif 60 <= accuracy <= 79:
                stats_bins['60-79%'] += 1
            elif 80 <= accuracy <= 99:
                stats_bins['80-99%'] += 1
            elif accuracy == 100:
                stats_bins['100%'] += 1

    user_list = sorted(user_list, key=itemgetter("count_points"), reverse=True)
    if passed_test > 0:
        average_accuracy = total_accuracy // passed_test 
    else:
        average_accuracy = 0

    bar_labels = list(stats_bins.keys())  
    bar_values = list(stats_bins.values())

    emit("results_list", {
        "users": user_list,
        "accuracy_result": accuracy_result,
        "average_accuracy": average_accuracy,
        "bar_labels": bar_labels,
        "bar_values": bar_values
    })

    emit("students_graphics", {"data":"ready"}, room=data["room"])

@socket.on("alarm-end")
def alarm_end(data):
    code = data["code"]
    index = data["index"]

    id_test = int(Rooms.query.filter_by(room_code= code).first().id_test)
    test: Test = Test.query.get(id_test)
    max_questions = test.questions.count("?%?") + 1

    emit("last-end", {"index": index, "max_questions": max_questions}, room = code, broadcast=True)

