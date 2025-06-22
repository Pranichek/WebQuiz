'''
Файл, де є код для отримання даних про тест, якщо користувач натиснув на якийсь тест на головній сторінці ,і хоче 
його пройти або зберегти у особистий профіль
'''
import flask, os, shutil
from flask_login import current_user
from .models import Test
from home.models import User
from os.path import abspath, join, exists
from Project.db import DATABASE


def render_data_test():
    if current_user.is_authenticated:
        message = ''
        test_id = flask.request.args.get("id_test")
        test = Test.query.get(int(test_id))

        count = 0
        answers = test.answers.split("?@?")
        correct_indexes = []
        list_final = []
        questions = test.questions.split("?%?")
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

        test.user.username
        test.category

        response = flask.make_response(
            flask.render_template(
            template_name_or_list = "test_data.html",
            test = test,
            list_final = list_final
            )
        )

        if test.check_del != "deleted":
            if flask.request.method == "POST":
                check_form = flask.request.form.get("check_form")
                test_id = int(flask.request.form["test_id"])
                test : Test = Test.query.get(test_id)
                test_title = test.title_test

                owner_id = int(test.user.id)
                owner : User = User.query.get(owner_id)

                path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests"))
                if int(owner_id) != int(current_user.id):
                    if exists(path= path):
                        if test_title not in os.listdir(path = path):
                            new_test = Test(
                            title_test = test_title,
                            questions = test.questions,
                            answers = test.answers,
                            question_time = test.question_time,
                            user_id = current_user.id,
                            category = test.category,
                            image = test.image
                        )   
                            path_owner = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(owner.email), "user_tests", str(test.title_test)))
                            path_user = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests", str(new_test.title_test)))
                            shutil.copytree(path_owner, path_user)

                            DATABASE.session.add(new_test)
                            DATABASE.session.commit()

                        else:
                            count_copy = 1
                            while True:
                                new_test = Test(
                                title_test = test_title + ("_copy" * count_copy),
                                questions = test.questions,
                                answers = test.answers,
                                question_time = test.question_time,
                                user_id = current_user.id,
                                category = test.category,
                                image = test.image
                            )   
                                try:
                                    path_owner = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(owner.email), "user_tests", str(test.title_test)))
                                    path_user = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests", str(new_test.title_test)))
                                    shutil.copytree(path_owner, path_user)
                                except:
                                    count_copy += 1
                                    continue

                                DATABASE.session.add(new_test)
                                DATABASE.session.commit()
                                break
                    else:
                        new_test = Test(
                            title_test = test_title,
                            questions = test.questions,
                            answers = test.answers,
                            question_time = test.question_time,
                            user_id = current_user.id,
                            category = test.category,
                            image = test.image
                        )

                        path_owner = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(owner.email), "user_tests", str(test.title_test)))
                        path_user = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests", str(new_test.title_test)))
                        shutil.copytree(path_owner, path_user)

                        DATABASE.session.add(new_test)
                        DATABASE.session.commit()

                    return flask.redirect("/")
                else:
                    message = "Це ваш тест"
        else:
            response = flask.make_response(
                flask.redirect(
                    '/home_auth.html'
                )
            )
            
        response = flask.make_response(
            flask.render_template(
                "test_data.html", 
                test= test,
                message = message,
                list_final = list_final
            )
        )
        return response
    else:
        return flask.redirect("/")