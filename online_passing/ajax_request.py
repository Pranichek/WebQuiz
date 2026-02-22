from Project.settings import project
from flask import request, jsonify
from home.models import User
import flask
from quiz.models import Test
from .correct_answers import return_answers

@project.route('/get_user_detail_stats', methods=['POST'])
def get_user_detail_stats():
    data = request.json
    user_id = data["user_id"]
    user : User = User.query.get(user_id)

    test : Test = Test.query.get(int(data["id_test"]))
    count_points = (test.questions.count("?%?") + 1) * 1000

    correct_indexes = []
    questions = test.questions.split("?%?")

    for index in range(len(questions)):
        correct_answers = return_answers(index= index, test_id= int(int(data["id_test"])))
        
        correct_indexes.append(correct_answers)
    
    user_answers = user.user_profile.all_answers.split()
    list_check = []
    types = test.type_questions.split("?$?")
    questions = test.questions.split("?%?")
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
            

    text_user_answers = []

    count_right_answers = 0
    count_uncorrect_answers = 0

    for i in range(len(user_answers)):
        time_data = []
        if len(correct_indexes[i]) > 0:
            if user_answers[i] != "∅":
                if types[i] == "one-answer":
                    if int(correct_indexes[i][0]) == int(user_answers[i]):
                        list_check.append("правильно")
                    else:
                        list_check.append("неправильно")
                    text_user_answers.append([list_answers[i][int(user_answers[i])]])

                elif types[i] == "many-answers":
                    correct = 0
                    uncorrect = 0
                    list_answs = user_answers[i].split("@")

                    for ans in list_answs:
                        time_data.append(list_answers[i][int(ans)])
                        if int(ans) in correct_indexes[i]:
                            count_right_answers += 1
                            correct += 1
                        else:
                            count_uncorrect_answers += 1
                            uncorrect += 1
                    text_user_answers.append(time_data)
                    
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

                    text_user_answers.append(user_answer_value)

                    if user_answer_value in new_answers:
                        list_check.append("правильно")
                    else:
                        count_uncorrect_answers += 1
                        list_check.append("неправильно")
            else:
                # не ответил
                list_check.append("пропустив")
        else:
            if user_answers[i] != "∅":
                list_check.append("правильно")
                
                if types[i] == "input-gap":
                    text_user_answers.append(user_answers[i])
                else:
                    indices = user_answers[i].split("@")
                    temp_text_answers = []
                    
                    for idx in indices:
                        if idx.isdigit():
                            try:
                                temp_text_answers.append(list_answers[i][int(idx)])
                            except IndexError:
                                pass
                                
                    text_user_answers.append(temp_text_answers)
            else:
                list_check.append("пропустив")
                text_user_answers.append("не відповідав")
    
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    count_answers = user.user_profile.data_questions

    avarage_times = user.user_profile.avarage_time.split()
    sum_time = 0
    for time in avarage_times:
        sum_time += int(time)
    sum_time = sum_time // len(avarage_times)
    
    # Приклад даних, які повертаємо:
    response_data = {
        "id": user.id,
        "username": user.username,
        "avatar": flask.url_for('profile.static', filename=f'images/edit_avatar/{user.name_avatar}'),
        "points": user.user_profile.count_points,
        "max_points": count_points,
        "accuracy": user.user_profile.all_procents.split()[-1], 
        "count_answers": count_answers,
        "avarage_time": sum_time,
        "questions": questions,
        "user_answers": text_user_answers,
        "list_check": list_check
    }

    return jsonify(response_data)