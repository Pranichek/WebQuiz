from Project.socket_config import socket
from quiz.models import Test
from .models import Rooms
from Project.db import DATABASE
import flask_login
from flask_socketio import emit
from home.models import User
from .correct_answers import return_answers


@socket.on("general-diagram")
def general_diagran(data):
    user_list = []
    room : Rooms = Rooms.query.filter_by(room_code= data["room"]).first()
    user_ids = room.users if room and room.users else []
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

    for user in user_ids:
        # user : User  = User.query.get(int(user_id))
        user.user_profile.answering_answer = "відповідає"
        DATABASE.session.commit()
        

        if user and user.id != flask_login.current_user.id:

            accuracy = int(user.user_profile.all_procents.split()[-1]) 
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
    
    average_accuracy = total_accuracy // passed_test

    bar_labels = list(stats_bins.keys())   # ['<40%', '40-59%', ...]
    bar_values = list(stats_bins.values())
    
    emit("general_diagram", {
        "accuracy_result": accuracy_result,
        "average_accuracy": average_accuracy,
        "bar_labels": bar_labels,
        "bar_values": bar_values
    })

# точкова одного користувача
@socket.on("student_diagram")
def dots_student(data):
    test : Test = Test.query.get(int(data["test_id"]))
    length_questions = test.questions.count("?%?") + 1

    list_question = []
    for index in range(length_questions):
        list_question.append(index + 1)
    user : User = User.query.get(int(data["id"]))
    list_procents = user.user_profile.all_procents
    

    emit("dots-diagram", {
        "list_question": list_question,
        "list_procents": list_procents
    })

@socket.on("dots-diagram")
def dots_diagram(data):
    room : Rooms = Rooms.query.filter_by(room_code= data["room"]).first()
    test : Test = Test.query.get(int(data["test_id"]))
    length_questions = test.questions.count("?%?") + 1

    list_question = []
    for index in range(length_questions):
        list_question.append(index + 1)

    list_procents = room.all_questions

    emit("dots-diagram", {
        "list_question": list_question,
        "list_procents": list_procents
    })

@socket.on("column-diagram")
def column_diagram(data):
    room : Rooms = Rooms.query.filter_by(room_code= data["room"]).first()
    test : Test = Test.query.get(int(data["test_id"]))
    
    length_questions = test.questions.count("?%?") + 1

    list_question = []
    for index in range(length_questions):
        list_question.append(index + 1)

    count_people = len(room.users)

    correct_answers = []
    uncorrect_answers = []

    answers = room.data_question.split()

    for answer in answers:
        list_answer = answer.split("/")
        correct_answers.append(int(list_answer[0]))
        uncorrect_answers.append(int(list_answer[1]))
    
    emit("column-diagram", {
        "correct_answers" :correct_answers,
        "uncorrect_answers": uncorrect_answers,
        "count_people": count_people,
        "length_answers": length_questions
    })
@socket.on("time-diagram")
def time_diagram(data):
    room = Rooms.query.filter_by(room_code=data["room"]).first()
    test = Test.query.get(int(data["test_id"]))
    users = room.users if room and room.users else []
    length_questions = test.questions.count("?%?") + 1 
    
    avarage_time = []
    quesetions_list = []

    for index in range(length_questions):
        sum_time = 0
        valid_users_count = 0 
        
        for user in users:
            times = user.user_profile.avarage_time.split()
            if len(times) > index:
                sum_time += int(times[index]) 
                valid_users_count += 1
        
        if valid_users_count > 0:
            avarage_time.append(sum_time // valid_users_count)
        else:
            avarage_time.append(0)
            
        quesetions_list.append(index + 1)

    emit("time_diagrams", {
        "avarage_time": avarage_time,
        "uesetions_list": quesetions_list 
    })

@socket.on("time-student")
def time_student(data):
    user : User = User.query.get(int(data["id"]))
    user_time = user.user_profile.avarage_time.split()
    avarage_time = []
    quesetions_list = []
    count = 1

    for time in user_time:
        avarage_time.append(int(time))
        quesetions_list.append(count)
        count+=1
    
    emit("time_diagrams", {
        "avarage_time": avarage_time,
        "uesetions_list": quesetions_list 
    })

@socket.on("questions-result")
def return_result(data):
    room : Rooms = Rooms.query.filter_by(room_code= data["room"]).first()
    test : Test = Test.query.get(int(data["test_id"]))
    users = room.users

    questions = test.questions.split("?%?")
    types = test.type_questions.split("?$?")

    answers = test.answers.split("?@?")
    list_answers = []
    for ans in answers:
        current_answers = []
        ans_clean = ans.replace("(?%+", "").replace("+%?)", "*|*|*").replace("(?%-", "").replace("-%?)", "*|*|*")
        current_answers.append(ans_clean)

        clear_answer = current_answers[0].split('*|*|*')
        if (clear_answer[-1] == ''):
            del clear_answer[-1]

        list_answers.append(clear_answer)

    final_list = []

    for index in range(len(questions)):
        total_answers = 0
        correct_answers = 0
        incorrect_answers = 0
        skip_answers = 0
        right_answers = return_answers(index= index, test_id= int(int(data["test_id"])))
        count_chosen = [0, 0, 0, 0]
        users_variants = []


        for user in users:
            user_answers = user.user_profile.all_answers.split()
            
            if len(user_answers) > 0 and user_answers[index] != "∅":
                total_answers += 1
                if types[index] == "one-answer":
                    count_chosen[int(user_answers[index])] += 1
                    if int(right_answers[0]) == int(user_answers[index]):
                        correct_answers += 1
                    else:
                        incorrect_answers += 1

                elif types[index] == "many-answers":
                    correct = 0
                    uncorrect = 0
                    list_answs = user_answers[index].split("@")

                    for ans in list_answs:
                        count_chosen[int(ans)] += 1
                        if int(ans) in right_answers:
                            correct += 1
                        else:
                            uncorrect += 1
                    
                    # расчитіваем сколько минимум должно біть правильніх ответов чтобы засчитать бал
                    count_min = len(right_answers) / 2 

                    if correct > int(count_min) and uncorrect == 0:
                        correct_answers += 1
                    else:
                        incorrect_answers += 1

                elif types[index] == "input-gap":
                    user_answer_value = user_answers[index]
                    answers_gaps = test.answers.split("?@?")[index].split("+%?)")
                    if "" in answers_gaps:
                        answers_gaps.remove("")
                    new_answers = []

                    for answer in answers_gaps:
                        answer = answer.replace("(?%+", "").replace("+%?)", "")
                        new_answers.append(answer)

                    users_variants.append(user_answer_value)
                    if user_answer_value in new_answers:
                        correct_answers += 1
                    else:
                        incorrect_answers += 1
            else:
                # не ответил
                skip_answers += 1

        current_answers = list_answers[index]
        variants = []

        for answer_index in range(len(current_answers)):
            answer = current_answers[answer_index]
            variants.append({
                "label": answer_index + 1,
                "text": answer,
                "is_correct": True if answer_index in right_answers else False,
                "count_choosen": count_chosen[answer_index]
            })
        
            


        time_dict = {
            "question_id": index + 1,
            "type_question": types[index],
            "question_text": questions[index],
            "users_variants": users_variants, # варіанти, що написали люди при питанні де треба дати відповідь вручну
            "stats": {
                "total_answers": total_answers,
                "correct_count": correct_answers,
                "incorrect_count": incorrect_answers,
                "skip_count": skip_answers
            },
            "variants": variants
        }

        final_list.append(time_dict)

    emit("ready_data", {"list_data": final_list})





    # {
    #     "question_id": 1,
    #     "question_text": "Для чого потрібен Auto Layout?",
    #     "stats": {
    #     "total_answers": 50,
    #     "correct_count": 35,
    #     "incorrect_count": 15
    #     },
    #     "variants": [
    #     {
    #         "label": "A", 
    #         "text": "Вариант ответа А (текст, если нужно)", 
    #         "count_choosen": 40,
    #         "is_correct": true 
    #     },
    #     {
    #         "label": "B",
    #         "count_choosen": 5,
    #         "is_correct": false
    #     },
    #     {
    #         "label": "C",
    #         "count_choosen": 5,
    #         "is_correct": false
    #     }
    #     ]
    # }
