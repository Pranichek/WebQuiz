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
    # if current_user.is_authenticated:
    flask.session["flag_end"] = "nope"

    message = ''
    test_id = flask.request.args.get("id_test")
    try:
        test = Test.query.get(int(test_id))
    except:
        return flask.redirect("/")
    

    count = 0
    answers = test.answers.split("?@?")
    types = test.type_questions.split("?$?")
    correct_indexes = []
    list_final = []
    questions = test.questions.split("?%?")
    for question in questions:
        one_question = {}
        one_question["question"] = question
        one_question["type_question"] = types[count]
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

    # получение картинок к тесту(и к вопросу и к ответу)
    img_lists = []
    count_questions = test.questions.count("?%?") + 1
    for index in range(count_questions):
        small_list = ["not" for index in range(len(list_final[index]["answers"]) + 1)]

        check_img = False

        path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(test.user.email), "user_tests", str(test.title_test), str(index + 1)))
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
            img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index + 1}/{name_img}")
        else:
            img_url = "not"

        small_list[0] = img_url
        # check the images for answers(tipo lol)

        range_len = len(list_final[index]["answers"]) + 1
        for index_answ in range(1, range_len):
            path = abspath(join(__file__, "..", "..", 
                    "userprofile", "static", "images", "edit_avatar", 
                    str(test.user.email), "user_tests", str(test.title_test), 
                    str(index + 1), str(index_answ)))
            
            if exists(path):                
                answer_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{email}/user_tests/{title}/{index + 1}/{index_answ}/{os.listdir(path)[0]}")

                small_list[index_answ] = answer_url

        img_lists.append(small_list)
    # -------------

    img_test = "default"
    if "default" not in test.image.split("/"):
        img_test = test.image
    response = flask.make_response(
        flask.render_template(
        template_name_or_list = "test_data.html",
        test = test,
        question_list = list_final,
        img_test = img_test,
        user = current_user,
        img_part = test.image.split('/')[1] if img_test == 'default' else test.image,
        img_lists = img_lists
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
                            image = test.image,
                            type_questions = test.type_questions
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
                                image = test.image,
                                type_questions = test.type_questions
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
                        image = test.image,
                        type_questions = test.type_questions
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
    
    img_test = "default"
    if "default" not in test.image.split("/"):
        img_test = test.image


    
    response = flask.make_response(
        flask.render_template(
            "test_data.html", 
            test= test,
            message = message,
            question_list = list_final,
            img_test = img_test,
            user = current_user,
            img_part = test.image.split('/')[1] if img_test == 'default' else test.image,
            img_lists = img_lists,
            test_data = True
        )
    )
    return response
