from Project.socket_config import socket
import flask_login, flask, os, random as r
from quiz.models import Test
from flask_socketio import emit, join_room
from os.path import abspath, join, exists
from home.models import User
from .models import Rooms
from Project.db import DATABASE
from .correct_answers import return_answers

def change_check(id: int, code: int):
    data_room: Rooms = Rooms.query.filter_by(room_code=code).first()
    users_id = []
    
    if data_room.sockets_users:
        check_socket : list = data_room.sockets_users
        users_id : list = data_room.users
    else:
        check_socket = []

    if User.query.get(id) not in check_socket:
        check_socket.append(str(id))

    if User.query.get(id) not in users_id:
        users_id.append(str(id))

    DATABASE.session.commit()

@socket.on("connect_room")
def connect_to_room(data):
    id_test = int(data["test_id"])
    index_question = int(data["index"])  

    join_room(room=data["code"])

    change_check(code=data["code"], id=flask_login.current_user.id)

    test : Test = Test.query.get(int(id_test))

    questions = test.questions.split("?%?")
    answers_blocks = test.answers.split("?@?")
    test_time = test.question_time.split("?#?")
    types = test.type_questions.split("?$?")

    correct_answers = return_answers(index= index_question, test_id= int(id_test))


    current_question = questions[index_question]
    test_time = test_time[index_question]
    current_type = types[index_question]

    current_answers_list = answers_blocks[index_question].split("?@?")
    current_answers = []

    for ans in current_answers_list:
        ans_clean = ans.replace("(?%+", "").replace("+%?)", "*|*|*").replace("(?%-", "").replace("-%?)", "*|*|*")
        current_answers.append(ans_clean)

    current_answers = current_answers[0].split('*|*|*')

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

    del current_answers[-1]

    # проверка на то что есть ли в ответах картинки или нет
    image_urls = ["none", "none", "none", "none"]
    if exists(path):
        for index in range(1, 5):
            current_path = join(path, str(index))
            if exists(current_path) and len(os.listdir(current_path)) > 0:
                url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index_question + 1}/{str(index)}/{os.listdir(current_path)[0]}")
                image_urls[index - 1] = url


    emit("student_question", {
        "answers_image": image_urls,
        "type": current_type,
        "question": current_question,
        "answers": current_answers,
        "index": index_question + 1,
        "amount_question": len(questions),
        "test_time": int(test_time) if test_time.isdigit() else test_time,
        "question_img": img_url if name_img else "not",
        "correct_answers": correct_answers,
        "value_bonus": "0" 
    })



    # code = data["code"]
    # room = Rooms.query.filter_by(room_code=code).first()

    # user_ids = room.users.split() if room.users is not None else []
    # if str(flask_login.current_user.id) not in user_ids:
    #     user_ids.append(str(flask_login.current_user.id))
    #     room.users = " ".join(user_ids)
    #     DATABASE.session.commit()

    # user_list = []
    # room = Rooms.query.filter_by(room_code = data["code"]).first()
    # user_ids = room.users.split() if room and room.users else []

    # for user_id in user_ids:
    #     user = User.query.get(int(user_id))
    #     if user and user.id != room.user_id:
    #         user_list.append({
    #             "username": user.username,
    #             "email": user.email,
    #             "ready": user.user_profile.answering_answer,
    #             "count_points": user.user_profile.count_points
    #         })

    # emit("users_data", {"user_list":user_list}, room=data["code"], broadcast=True)

# remaining_time = max(total_time - time_taken, 0)
# score = max_score * (0.5 + (1 - 0.5) * (remaining_time / total_time))

@socket.on("answered")
def answer_the_question(data):
    
    try:
        if (data["right_answered"] != "not"):
            remaining_time = max(int(data["total_time"]) - int(data["wasted_time"]), 0)
            score = 1000 * (0.2 + (1 - 0.2) * (remaining_time / int(data["total_time"])))

            old_points = flask_login.current_user.user_profile.count_points
            new_points = old_points + score
            flask_login.current_user.user_profile.count_points = int(new_points)
    except:
        pass

    flask_login.current_user.user_profile.answering_answer = "відповів"
    flask_login.current_user.user_profile.index_question = int(data["index"]) 
    DATABASE.session.commit()
    

    # -------------------- последний ответ пользователя
    test : Test = Test.query.get(int(data["id_test"]))
    answers = test.answers.split("?@?")
    type = test.type_questions.split("?$?")[int(data["index"])]
    ready_answers = ""

    if type != "input-gap":
        current_answers = []
        current_answers_list = answers[int(data["index"])].split("?@?")

        for ans in current_answers_list:
            ans_clean = ans.replace("(?%+", "").replace("+%?)", "*|*|*").replace("(?%-", "").replace("-%?)", "*|*|*")
            current_answers.append(ans_clean.split("*|*|*"))
            try:
                current_answers.remove("")
            except:
                pass

        ready_answers = ""
        user_answers = data["lastanswers"]

        count_img = 1
        if user_answers != "∅":
            if len(user_answers.split("@")) > 1:
                user_answers = user_answers.split("@")
                for answer in user_answers:
                    if answer.isdigit():
                        if current_answers[0][int(answer)] != "image?#$?image":
                            ready_answers += current_answers[0][int(answer)] + " "
                        else:
                            ready_answers += f"зображення{count_img}" + " "
                            count_img+=1
            else:
                for answer in user_answers:
                    if answer.isdigit():
                        if current_answers[0][int(answer)] != "image?#$?image":
                            ready_answers += current_answers[0][int(answer)] + " "
                        else:
                            ready_answers += f"зображення{count_img}" + " "
                            count_img += 1
        else:
            ready_answers = "пропустив"
    else:
        if data["lastanswers"] != "∅":
            ready_answers = data["lastanswers"]
        else:
            ready_answers = "пропустив"

    
    # часть где мы считам точность
    user_answers_raw = data["users_answers"]

    if user_answers_raw == '':
        user_answers_raw = "∅"

    
    user_answers = user_answers_raw.split(",") 
    
    questions = test.questions.split("?%?")
    answers = test.answers.split("?@?")

    # список где хранятся праивльные индексы либо строчные ответы на вопрос
    correct_indexes = []


    raw_type = DATABASE.session.query(Test.type_questions).filter_by(id=int(data["id_test"])).first()
    for el in raw_type:
        types_quest = el.split("?$?")
    
    
    # 
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
        correct_answers = return_answers(index= index, test_id= int(int(data["id_test"])))
        
        correct_indexes.append(correct_answers)

    count_right_answers = 0


    list_users_answers = []
    if len(user_answers) > 0:
        for answers in user_answers:
            small_list = []
            list_users_answers.append(answers.split("@"))  

    count_uncorrect_answers = 0
    count_answered = 0

    index_corect = []
    types = test.type_questions.split("?$?")

    # счеткички сколько именно правильных а сколько нет
    right_answers = 0
    uncorrect_answers = 0
    # список для того чтобы понимать правильно он ответил последний вопрос или нет
    check_answers = []


    for i in range(len(user_answers)):
        if list_users_answers[i][0] != "∅":
            count_answered += 1
            if types[i] == "one-answer":
                if int(correct_indexes[i][0]) == int(list_users_answers[i][0]):
                    count_right_answers += 1
                    index_corect.append(i)
                    right_answers += 1
                    check_answers.append(1)
                else:
                    count_uncorrect_answers += 1
                    uncorrect_answers += 1
                    check_answers.append(0)

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
                    check_answers.append(1)
                else:
                    uncorrect_answers += 1
                    check_answers.append(0)
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
                    check_answers.append(1)
                else:
                    count_uncorrect_answers += 1
                    uncorrect_answers += 1
                    check_answers.append(0)
        else:
            # не ответил
            check_answers.append(2)

    answered_questions = int(data["index"]) + 1   # сколько вопросов уже пройдено
    accuracy = (right_answers  / answered_questions) * 100 if answered_questions > 0 else 0

    if len(ready_answers.split()) == 1: 
        flask_login.current_user.user_profile.last_answered = f"{ready_answers.split()[0]}𒀱{accuracy}𒀱{check_answers[int(data['index'])]}𒀱{data['lastanswers']}"
    else:
        flask_login.current_user.user_profile.last_answered = f"{ready_answers}𒀱{accuracy}𒀱{check_answers[int(data['index'])]}𒀱{data['lastanswers']}"
    
    # --------------------

    user_list = []
    room : Rooms = Rooms.query.filter_by(room_code= data["code"]).first()
    user_ids = room.users if room and room.users else []

    count_answered = 0
    count_people = 0
    for user in user_ids:
        # user = User.query.get(int(user_id))
        if user and user.id != room.user_id:
            count_people += 1
            if user.user_profile.answering_answer == "відповів":
                count_answered += 1

            avatar_url = flask.url_for('profile.static', filename=f'images/edit_avatar/{user.name_avatar}')
            pet_url = flask.url_for(
                'profile.static',
                filename=f'images/pets_id/{user.user_profile.pet_id}.png'
            )

            user_list.append({
                "username": user.username,
                "ready": user.user_profile.answering_answer,
                "count_points": user.user_profile.count_points,
                "user_avatar": avatar_url,
                "pet_img": pet_url,
                "id": user.id
            })
    if "finish" in data.keys():
        DATABASE.session.commit()
        emit("finish_student")
    elif count_answered >= count_people or "check_end" in data.keys():
        room.sockets_users.clear()
        DATABASE.session.commit()
        emit("update_users", {"user_list": user_list}, room=data["code"], broadcast=True)
        emit("page_result", room=data["code"], broadcast=True)
    else:
        emit("update_users", {"user_list":user_list}, room=data["code"], broadcast=True)
        emit("page_waiting")

    DATABASE.session.commit()

   
# сокет чтобы получить данные ответа пользователя когда он ждет
@socket.on("get_data")
def return_data(data):
    # change_check(id = flask_login.current_user.id, code=data["room_code"])
    # ----------------
    index_question = int(data["index_question"]) - 1
    id_test = int(data["id_test"])

    test : Test = Test.query.get(id_test)
    questions = test.questions.split("?%?")

    current_question = questions[index_question]

    path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(test.user.email), "user_tests", str(test.title_test), str(int(data["index_question"]))))
    if exists(path):
        name_img = None
        for small_path in os.listdir(path):
            if small_path not in ["1", "2", "3", "4"]:
                name_img = small_path
                break            
    else:
        name_img = None

    email = test.user.email
    title = test.title_test
    img_url = "not"
    if name_img:
        img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{int(data['index_question'])}/{name_img}")
    else:
        img_url = "not"

    current_type = test.type_questions.split("?$?")[index_question]
    answers = test.answers.split("?@?")
    ready_answers = ""

    if current_type != "input-gap":
        current_answers = []
        current_answers_list = answers[int(data["index_question"]) - 1].split("?@?")

        for ans in current_answers_list:
            ans_clean = ans.replace("(?%+", "").replace("+%?)", "*|*|*").replace("(?%-", "").replace("-%?)", "*|*|*")
            current_answers.append(ans_clean.split("*|*|*"))
        user_answers = data["lastanswers"]

        
        if user_answers != "∅":
            if len(user_answers.split("@")) > 1:
                user_answers = user_answers.split("@")
                for answer in user_answers:
                    
                    if current_answers[0][int(answer)] != "image?#$?image":
                        ready_answers += current_answers[0][int(answer)] + "𒀱"
                    else:
                        ready_answers += f"зображення{int(answer) + 1}" + "𒀱"
            else:
                for answer in user_answers:
                    
                    if current_answers[0][int(answer)] != "image?#$?image":
                        ready_answers += current_answers[0][int(answer)] + "𒀱"
                    else:
                        ready_answers += f"зображення{int(answer)+1}" + "𒀱"
        else:
            ready_answers = "пропустив"
    else:
        if data["lastanswers"] != "∅":
            ready_answers = data["lastanswers"]
        else:
            ready_answers = "пропустив"
            

    #подсчет точности и правильных/неправильных ответов

    user_answers_raw = data.get("users_answers")
    if user_answers_raw == '':
        user_answers_raw = "∅"

    test_id = data.get("id_test")

    user_answers = user_answers_raw.split(",")
    test = Test.query.get(int(test_id))
    
    questions = test.questions.split("?%?")
    answers = test.answers.split("?@?")
    correct_indexes = []

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
        correct_answers = return_answers(index= index, test_id= int(test_id))
        
        correct_indexes.append(correct_answers)

    count_right_answers = 0


    list_users_answers = []
    if len(user_answers) > 0:
        for answers in user_answers:
            list_users_answers.append(answers.split("@"))

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


    answered_questions = int(data["index_question"])   # сколько вопросов уже пройдено
    accuracy = (right_answers / answered_questions) * 100 if answered_questions > 0 else 0
    # ------------------------------------------------------------------------------------
    # ссылки на картинки, если они были подргуженны к ответам
    path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(test.user.email), "user_tests", str(test.title_test), str(int(data["index_question"]))))

  
    answers = data["lastanswers"].split("@")
    images_urls = []
    if test.type_questions.split('?$?')[int(data["index_question"]) - 1] != "input-gap":
        for answer in answers:
            if answer != "∅":
                current_answer = str(int(answer) + 1)

                answer_path = join(path, current_answer)
                
                if exists(answer_path):
                    if len(os.listdir(answer_path)) > 0:
                        images_answer = flask.url_for("profile.static", filename=f"images/edit_avatar/{email}/user_tests/{title}/{int(data['index_question'])}/{current_answer}/{os.listdir(answer_path)[0]}")
                        images_urls.append(images_answer)

                    else:
                        images_urls.append("NOT")
                else:
                    images_urls.append("NOT")



    # --------------- для старницы текущих резьультатов студента
    test : Test = Test.query.get(int(data["id_test"]))
    index_question = int(data["index_question"]) - 1
    text_question = test.questions.split("?%?")[index_question]
    type_question = test.type_questions.split('?$?')[index_question]


    answers = test.answers.split("?@?")[index_question]
    clear_answers = None
    ans_clean = answers.replace("(?%+", "").replace("+%?)", "*|*|*").replace("(?%-", "").replace("-%?)", "*|*|*")
    clear_answers = ans_clean.split('*|*|*')
    if "" in clear_answers:
        clear_answers.remove("")


    user_list = []
    room : Rooms = Rooms.query.filter_by(room_code= data["room_code"]).first()
    user_ids = room.users


    count_people_answes = []
    for answer in clear_answers:
        count_people_answes.append(0)

    for user in user_ids:
        # user : User  = User.query.get(int(user_id))
        if user and int(room.user_id) != int(user.id):            
            count = 0
            count_image = 1
            users_answers = user.user_profile.last_answered.split("𒀱")[0].split()
            for user_answer in users_answers:
                if type_question != "input-gap":
                    if user_answer == "image?#$?image":
                        users_answers[count] = f"зображення{count_image}"
                        count_image+=1

                    users_answers[count] = f"{count+1}){users_answers[count]}"
                    count+=1

            user_list.append({
                "username": user.username
            })

            if type_question != "input-gap":
                answers = user.user_profile.last_answered.split("𒀱")
                answers = answers[-1].split("@") if  len(answers[-1]) > 1 else answers[-1]
                
                try:
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
                except:
                    pass

    if type_question != "input-gap":
        count = 0
        count_image = 1
        for answer in clear_answers:
            if answer == "image?#$?image":
                clear_answers[count] = f"зображення   {count_image}"
                count_image += 1
            count+=1

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

    
    emit(
        "show_data",
        {
            "image":img_url,
            "question": current_question,
            "type_question": current_type,
            "answers": ready_answers,
            "normal_answers": clear_answers,
            "accuracy": accuracy,
            "right_answers": right_answers,
            "uncorrect_answers": uncorrect_answers,
            "user_indexes": data["lastanswers"], # 
            "correct_indexes": correct_indexes[int(data["index_question"]) - 1],
            "answers_images": images_urls,
            "type_question": type_question, 
            "text_question":text_question,
            "image_url":img_url,
            "users": user_list,
            "count_answers":count_people_answes
        }
    )



