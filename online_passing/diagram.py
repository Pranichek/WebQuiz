from Project.socket_config import socket
from quiz.models import Test
from .models import Rooms
from Project.db import DATABASE
import flask_login
from flask_socketio import emit
from home.models import User


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

            accuracy = int(user.user_profile.last_answered.split("𒀱")[1].split(".")[0]) 
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