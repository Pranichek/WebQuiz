import flask, flask_login
from quiz import Test

def render_finish_test():
    if flask_login.current_user.is_authenticated:
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

            for answer_block in answers:
                # Вилучаємо зайві символи, щоб виділити варіанти відповіді
                # Спочатку знайдемо всі варіанти в дужках (наприклад, (?%+да+%?))
                variants = []
                temp = ""
                depth = 0
                for ch in answer_block:
                    if ch == "(":
                        depth += 1
                        if depth == 1:
                            temp = ""
                        else:
                            temp += ch
                    elif ch == ")":
                        depth -= 1
                        if depth == 0:
                            variants.append(temp)
                        else:
                            temp += ch
                    else:
                        if depth > 0:
                            temp += ch

                # Знаходимо індекс правильного варіанту (позначений "+")
                correct_index = -1
                for i, variant in enumerate(variants):
                    if "+%" in variant or variant.startswith("?%+"):
                        correct_index = i
                        break

                correct_indexes.append(correct_index)

            print(correct_indexes, "da")
            print(user_answers, "user_answers")
            count_right_answers = 0
            for i in range(len(user_answers)):
                if int(user_answers[i]) == correct_indexes[i]:
                    count_right_answers += 1
            

            return flask.render_template(
                "test_finish.html",
                amount_questions = len(questions),
                right_answers = count_right_answers
            )
        else:
            return flask.redirect("/")
    else:
        return flask.redirect("/")