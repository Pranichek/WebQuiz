import flask, flask_login
from quiz import Test

def render_finish_test():
    if flask_login.current_user.is_authenticated:
        response = flask.make_response(
            "test_finish.html"
        )
        index_test = int(flask.request.cookies.get("index_question"))
        test_id = flask.request.cookies.get("test_id")
        user_answers = flask.request.cookies.get("users_answers")
    

        if test_id is not None and user_answers is not None:
            test : Test = Test.query.get(int(test_id))
            questions = test.questions.split("?%?")
            user_answers = user_answers.split(",")
            # вот пример ответов
            # (?%+да+%?)(?%-нет-%?)?@?(?%+да+%?)(?%-нет-%?)?@?(?%+да+%?)(?%-нет-%?)
            answers = test.answers.split("?@?")
            correct_indexes = []

            print(answers, "ответы")

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

                

            # ['(?%+ывам+%?)(?%-ывам-%?)(?%+ывам+%?)', '(?%+ывам+%?)(?%+ывам+%?)(?%+ывам+%?)(?%-ывамывам-%?)', '(?%+ывам+%?)(?%-ывам-%?)']
            print(correct_indexes, "правильные индексы")
            print(user_answers, "user_answers")
            count_right_answers = 0

            list_users_answers = []
            for answers in user_answers:
                small_list = []
                list_users_answers.append(answers.split("@"))

            print(list_users_answers, "hahahhah")
            # проверка сколько правильно ответил юзер
            print(user_answers)


            for i in range(len(user_answers)):
                if list_users_answers[i][0] != "skip":
                    if len(correct_indexes[i]) == 1:
                        if int(correct_indexes[i][0]) == int(list_users_answers[i][0]):
                            count_right_answers += 1
                    else:
                        for ans in list_users_answers[i]:
                            if int(ans) in correct_indexes[i]:
                                count_right_answers += 1


            # максимальное количество баллов
            amount_points = 0
            for index in correct_indexes:
                amount_points += len(index)

            accuracy = (count_right_answers / amount_points) * 100 if amount_points > 0 else 0

            response =  flask.make_response(
                flask.render_template(
                    "test_finish.html",
                    amount_questions = amount_points,
                    right_answers = count_right_answers,
                    accuracy = accuracy
                )
            )

            response.delete_cookie("user_answers")

            # response.set_cookie("index_question", "0")
            # response.set_cookie("time_question", "set")

            return response

            
            # return flask.render_template(
            #     "test_finish.html",
            #     amount_questions = amount_points,
            #     right_answers = count_right_answers,
            #     accuracy = accuracy
            # )
        else:
            return flask.redirect("/userprofile/tests")
    else:
        return flask.redirect("/")