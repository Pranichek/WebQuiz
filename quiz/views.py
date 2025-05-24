'''
    ?%? між питаннями 
    ?#? між часом проходження різних питань
    ?@? між відповідями на різні питання
    ?&? між картинками
    (?%+...+%?) правильна відповідь
    (?%-...-%?) неправильна відповідь

    Запис + та - для відповідей у JavaScript
'''

import flask, os, flask_login
from .models import Test
from Project.db import DATABASE
from os.path import abspath, join, exists
from flask_login import current_user
import PIL.Image
from .del_files import delete_files_in_folder
from Project.authenticated_check import config_page


def render_test():
    if current_user.is_authenticated:
        list_to_template = []
        new_questions = ""
        new_answers = ""
        category = ""
        name_image = ''
        try:
            new_questions = flask.request.cookies.get("questions").encode('raw_unicode_escape').decode('utf-8')
            new_answers = flask.request.cookies.get("answers").encode('raw_unicode_escape').decode('utf-8')
            category = flask.request.cookies.get("category").encode('raw_unicode_escape').decode('utf-8')
            name_image = flask.request.cookies.get("test_url").encode('raw_unicode_escape').decode('utf-8')
        except:
            pass


        if flask.request.method == "POST":
            check_form = flask.request.form.get('check_post')

            if check_form == "create_test":
                # print(name_image, "name")
                test_title = flask.request.form["test_title"]
                question_time = flask.request.cookies.get("time").encode('raw_unicode_escape').decode('utf-8')
                question_images = flask.request.cookies.get("images").encode('raw_unicode_escape').decode('utf-8')

                test = Test(
                    title_test = test_title,
                    questions = new_questions,
                    answers = new_answers,
                    question_time = question_time,
                    question_images = question_images,
                    user_id = flask_login.current_user.id,
                    category = category,
                    image = flask.session["test_image"] if "test_image" in flask.session and flask.session["test_image"] != "default" else "default"
                )

                response = flask.make_response(flask.redirect('/'))

                try:
                    response.delete_cookie("questions")
                    response.delete_cookie("answers")
                    response.delete_cookie("time")
                    response.delete_cookie("category")
                    response.delete_cookie("inputname")
                    response.delete_cookie("test_url")
                except:
                    pass

                # try:
                if not exists(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests"))):
                    os.mkdir(path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests")))
                if not exists(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests",  str(test_title)))):
                    os.mkdir(path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests",  str(test_title))))
                # except:
                #     pass
                if "test_image" in flask.session and flask.session["test_image"] != "default":

                    test_image = PIL.Image.open(fp = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "cash_test", flask.session["test_image"])))
                    test_image = test_image.save(fp = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests", str(test_title), str(flask.session["test_image"]))))
                    os.remove(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "cash_test", flask.session["test_image"]))
                )

                if "test_image" in flask.session:
                    flask.session.pop("test_image", None)

                DATABASE.session.add(test)
                DATABASE.session.commit()
                return response
            elif check_form == "image":
                image = flask.request.files["image"]
        
                if not exists(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "cash_test"))):
                    os.mkdir(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "cash_test")))

                flask.session["test_image"] = str(image.filename)
                delete_files_in_folder(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "cash_test")))
                image.save(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "cash_test", str(image.filename))))
            elif check_form == "del_image":
                flask.session["test_image"] = "default"
        # else:
        if new_questions:
            new_answers_list = new_answers.split("?@?")
            new_questions_list = new_questions.split("?%?")

            number = 0
            for question in new_questions_list:
                item = {}
                item["question"] = question
                answers_list = new_answers_list[number].split("%?)(?%")
                temporary_answers_list = []
                for answer in answers_list:
                    answer = answer.replace("(?%", "")
                    answer = answer.replace("%?)", "")
                    answer = answer[1:-1]
                    temporary_answers_list.append(answer)
                item["answers"] = temporary_answers_list
                list_to_template.append(item)
                # print("list_to_template =", list_to_template)
                number += 1
        # print("list_to_template =", list_to_template)
        return flask.render_template(
            template_name_or_list= "test.html", 
            question_list = list_to_template,
            user = flask_login.current_user,
            cash_image = flask.session["test_image"] if "test_image" in flask.session and flask.session["test_image"] != "default" else "default"
        )
    else:
        return flask.redirect("/")
    
def render_create_question():
    if current_user.is_authenticated:
        if flask.request.method == "POST":
            image = flask.request.files["image"]

            if not os.path.exists(os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_test"))):
                os.mkdir(os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_test")))

            image.save(os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "images_test", str(image.filename))))

        return flask.render_template(template_name_or_list= "create_question.html")
    return flask.redirect("/")


def render_select_way():
    if current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "select_way.html"
        )
    return flask.redirect("/")
