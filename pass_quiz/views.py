# # import flask, flask_login
# # from quiz import Test

# # def render_finish_test():
# #     if flask_login.current_user.is_authenticated:   
# #         user_asnwers = ["1", "1"]
# #         test_id = 1

# #         if flask.request.method == "POST":
# #             user_asnwers =  flask.request.form.get("users_answers").split(",")
# #             test_id = flask.request.form.get("test_id")
# #             print("da")
# #         if test_id is not None:
# #             test: Test = Test.query.get(int(test_id))
# #             questions = test.questions.split("?%?")
        

# #             answers = test.answers.split("?@?")
# #             correct_indexes = []

# #             print(answers, "ответы")

# #             for index in range(len(questions)):
# #                 current_answer_list = answers[index]
# #                 data_str = ''
# #                 for symbol in current_answer_list:
# #                     if symbol == '+' or symbol == '-':
# #                         data_str += symbol

# #                 symbol_list = []
# #                 for i in range(0, len(data_str), 2):
# #                     symbol_list.append(data_str[i:i+2])

# #                 question_right_answers = []
# #                 for i in range(len(symbol_list)):
# #                     if symbol_list[i] == '++':
# #                         question_right_answers.append(i)

# #                 correct_indexes.append(question_right_answers)

# #             print(correct_indexes, "правильные индексы")
# #             print(user_asnwers, "user_asnwers")

# #             count_right_answers = 0

# #             list_users_answers = []
# #             if len(user_asnwers) > 0:
# #                 for answers in user_asnwers:
# #                     list_users_answers.append(answers.split("@"))

# #             print(list_users_answers, "hahahhah")
# #             print(user_asnwers)

# #             for i in range(len(user_asnwers)):
# #                 if list_users_answers[i][0] != "skip":
# #                     if len(correct_indexes[i]) == 1:
# #                         if int(correct_indexes[i][0]) == int(list_users_answers[i][0]):
# #                             count_right_answers += 1
# #                     else:
# #                         for ans in list_users_answers[i]:
# #                             if int(ans) in correct_indexes[i]:
# #                                 count_right_answers += 1

# #             amount_points = 0
# #             for index in correct_indexes:
# #                 amount_points += len(index)

# #             accuracy = (count_right_answers / amount_points) * 100 if amount_points > 0 else 0
# #             print(accuracy)
# #             print(count_right_answers, "da")

# #             return flask.render_template(
# #                     "test_finish.html",
# #                     amount_questions=amount_points,
# #                     right_answers=count_right_answers,
# #                     accuracy=accuracy
# #                 )
# #         else:
# #             return flask.redirect("/userprofile/tests")
# #     else:
# #         return flask.redirect("/")

# import flask, flask_login
# from quiz import Test

# import flask, flask_login
# from quiz import Test

# def render_finish_test():
#     if not flask_login.current_user.is_authenticated:
#         return flask.redirect("/")

#     # if flask.request.method != "POST":
#     #     return flask.redirect("/userprofile/tests")

#     user_answers_raw = flask.request.form.get("users_answers", "")
#     test_id = flask.request.form.get("test_id")

#     # if not user_answers_raw or not test_id:
#     #     return flask.redirect("/userprofile/tests")

#     try:
#         user_answers = user_answers_raw.split(",")
#         test: Test = Test.query.get(int(test_id))
#         # if not test:
#         #     return flask.redirect("/userprofile/tests")

#         questions = test.questions.split("?%?")
#         answers = test.answers.split("?@?")
#         correct_indexes = []

#         for answer_string in answers:
#             data_str = ''.join([s for s in answer_string if s in "+-"])
#             symbol_list = [data_str[i:i+2] for i in range(0, len(data_str), 2)]

#             question_right_answers = [i for i, sym in enumerate(symbol_list) if sym == '++']
#             correct_indexes.append(question_right_answers)

#         count_right_answers = 0
#         list_users_answers = [ans.split("@") for ans in user_answers]

#         for i in range(min(len(correct_indexes), len(list_users_answers))):
#             user_ans = list_users_answers[i]
#             if user_ans[0] == "skip":
#                 continue
#             if len(correct_indexes[i]) == 1:
#                 if int(correct_indexes[i][0]) == int(user_ans[0]):
#                     count_right_answers += 1
#             else:
#                 for ans in user_ans:
#                     if int(ans) in correct_indexes[i]:
#                         count_right_answers += 1

#         amount_points = sum(len(indexes) for indexes in correct_indexes)
#         accuracy = (count_right_answers / amount_points) * 100 if amount_points > 0 else 0

#         return flask.render_template(
#             "test_finish.html",
#             amount_questions=amount_points,
#             right_answers=count_right_answers,
#             accuracy=accuracy
#         )

#     except Exception as e:
#         print("Error processing test finish:", str(e))
#         # return flask.redirect("/userprofile/tests")
from flask import Flask, render_template, request
from flask_socketio import emit
from quiz import Test
from Project.socket_config import socket


def render_finish_test():
    return render_template("test_finish.html")

@socket.on("finish_test")
def handle_finish_test(data):
    print("result")
    user_answers_raw = data.get("users_answers")
    if user_answers_raw == '':
        print(888)
        user_answers_raw = 'skip'
    print(user_answers_raw , 17)
    test_id = data.get("test_id")

    user_answers = user_answers_raw.split(",")
    test = Test.query.get(int(test_id))
    questions = test.questions.split("?%?")
    answers = test.answers.split("?@?")
    correct_indexes = []

    user_answers = user_answers_raw.split(",")


    questions = test.questions.split("?%?")
    answers = test.answers.split("?@?")
    correct_indexes = []

    for answer_string in answers:
        data_str = ''.join([s for s in answer_string if s in "+-"])
        symbol_list = [data_str[i:i+2] for i in range(0, len(data_str), 2)]

        question_right_answers = [i for i, sym in enumerate(symbol_list) if sym == '++']
        correct_indexes.append(question_right_answers)

    count_right_answers = 0
    list_users_answers = [ans.split("@") for ans in user_answers]

    for i in range(min(len(correct_indexes), len(list_users_answers))):
        user_ans = list_users_answers[i]
        if user_ans[0] == "skip":
            continue
        if len(correct_indexes[i]) == 1:
            if int(correct_indexes[i][0]) == int(user_ans[0]):
                count_right_answers += 1
        else:
            for ans in user_ans:
                if int(ans) in correct_indexes[i]:
                    count_right_answers += 1

    amount_points = sum(len(indexes) for indexes in correct_indexes)
    accuracy = (count_right_answers / amount_points) * 100 if amount_points > 0 else 0
    print(amount_points, accuracy, count_right_answers, "gg")
    emit("test_result", {
        "amount_questions": amount_points,
        "right_answers": count_right_answers,
        "accuracy": accuracy
    })


