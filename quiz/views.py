'''
    ?%? між питаннями 
    ?#? між часом проходження різних питань
    ?@? між відповідями на різні питання
    ?&? між картинками
    (?%+...+%?) правильна відповідь
    (?%-...-%?) неправильна відповідь

    Запис + та - для відповідей у JavaScript
'''

import json
import flask, os, flask_login, shutil, PIL.Image
from .models import Test, TestData
from Project.db import DATABASE
from os.path import abspath, join, exists
from flask_login import current_user
from .del_files import delete_files_in_folder
from .generate_image import return_img
from Project.login_check import login_decorate


@login_decorate
def render_test():
    list_to_template = []
    new_questions = ""
    new_answers = ""
    category = ""
    try:
        new_questions = flask.request.cookies.get("questions").encode('raw_unicode_escape').decode('utf-8')
        new_answers = flask.request.cookies.get("answers").encode('raw_unicode_escape').decode('utf-8')
        category = flask.request.cookies.get("category").encode('raw_unicode_escape').decode('utf-8')
    except:
        pass


    if flask.request.method == "POST":
        check_form = flask.request.form.get('check_post')

        cookie_questions = flask.request.cookies.get("questions")
        answers_cookies = flask.request.cookies.get("answers")

        if check_form == "create_test" and cookie_questions is not None and answers_cookies is not None:
            # print(name_image, "name")
            test_title = flask.request.form["test_title"]
            question_time = flask.request.cookies.get("time").encode('raw_unicode_escape').decode('utf-8')

            test = Test(
                title_test = test_title,
                questions = new_questions,
                answers = new_answers,
                question_time = question_time,
                user_id = flask_login.current_user.id,
                category = category,
                image = flask.session["test_image"] if "test_image" in flask.session and flask.session["test_image"] != "default" else f"default/{return_img(category = category)}"
            )

            test_data = TestData()
            test.test_profile = test_data

            response = flask.make_response(flask.redirect('/'))

            try:
                response.delete_cookie("questions")
                response.delete_cookie("answers")
                response.delete_cookie("time")
                response.delete_cookie("category")
                response.delete_cookie("inputname")
                response.delete_cookie("test_url")
                response.delete_cookie("images")
            except:
                pass

            # try:
            if not exists(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests"))):
                os.mkdir(path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests")))
            if not exists(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests",  str(test_title)))):
                os.mkdir(path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests",  str(test_title))))
            # except:
            #     pass

            from_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests"))
            for dir in os.listdir(from_path):
                folder_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", dir))
                to_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests", test_title))
                shutil.move(folder_path, to_path)


            from_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests"))
            to_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests"))
            if len(os.listdir(from_path)) > 0:
                shutil.move(from_path, to_path)

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
    new_answers_list = ''
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
            item["pk"] = number
            list_to_template.append(item)
            number += 1
    
    return flask.render_template(
        template_name_or_list= "test.html", 
        question_list = list_to_template,
        user = flask_login.current_user,
        cash_image = flask.session["test_image"] if "test_image" in flask.session and flask.session["test_image"] != "default" else "default"
    )

@login_decorate
def render_create_question():
    if flask.request.method == "POST":
        image = flask.request.files["image"]

        print("questions =", flask.request.cookies.get("questions").encode('raw_unicode_escape').decode('utf-8'))
        questions_cookie = flask.request.cookies.get("questions")
        if questions_cookie:
            questions_list = list(filter(None, questions_cookie.split("?%?")))
            question_number = len(questions_list)

        print("question_number =", question_number)

        path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(question_number)))

        if not os.path.exists(path):
            os.makedirs(path)

    return flask.render_template(template_name_or_list= "create_question.html")

@login_decorate
def render_select_way():
    response = flask.make_response(
        flask.render_template(
            template_name_or_list = "select_way.html"
        )
    )
    try:
        response.delete_cookie("questions")
        response.delete_cookie("answers")
        response.delete_cookie("time")
        response.delete_cookie("category")
        response.delete_cookie("inputname")
        response.delete_cookie("test_url")
        response.delete_cookie("images")
    except:
        pass
    return response

@login_decorate
def render_change_question(pk: int):
    if flask.request.method == "POST":
        image = flask.request.files["image"]
        if image:
            print("pk (change)=", pk)
            dir_path = None
            try:
                dir_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1)))
            except:
                dir_path = os.makedirs(os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1))))
            for filename in os.listdir(dir_path):
                file_path = os.path.join(dir_path, filename)
                try:
                    os.unlink(file_path)
                except Exception as e:
                    print(f"Failed to delete {file_path}. Reason: {e}")
            try:
                image.save(os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1), str(image.filename))))
            except Exception as e:
                print("saving image error:", e)
        return flask.redirect("/test")
    
    else:
        questions = flask.request.cookies.get("questions").encode('raw_unicode_escape').decode('utf-8')
        answers = flask.request.cookies.get("answers").encode('raw_unicode_escape').decode('utf-8')
        question_time = flask.request.cookies.get("time").encode('raw_unicode_escape').decode('utf-8')

        # current_image = images.split("?&?")[pk]
        current_question = questions.split("?%?")[pk]
        current_time = question_time.split("?#?")[pk]
        current_answers = answers.split("?@?")[pk]
        answers_list = current_answers.split("%?)(?%")
        answers = []

        correctAnswers = []
        for answer in answers_list:
            answer = answer.replace("(?%", "")
            answer = answer.replace("%?)", "")
            if answer[0] == "+":
                correctAnswers.append("correct")
            else:
                correctAnswers.append("not")
            answer = answer[1:-1]
            answers.append(answer)
        while True:
            if len(answers) < 4:
                answers.append("hidden")
            else:
                break
        deletion_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "images_tests", str(pk + 1)))
        print("path =", deletion_path)
        file_exists = None
        try:
            print("os.listdir(deletion_path) =", os.listdir(deletion_path))
            os.listdir(deletion_path)[0]
            file_exists = True
        except:
            pass
    
    return flask.render_template(
        template_name_or_list = "change_question.html",
        question = current_question,
        # image = current_image,
        answer1 = answers[0],
        answer2 = answers[1],
        answer3 = answers[2],
        answer4 = answers[3],
        correct1 = correctAnswers[0],
        correct2 = correctAnswers[1],
        correct3 = correctAnswers[2] if len(correctAnswers) > 2 else "not",
        correct4 = correctAnswers[3] if len(correctAnswers) > 3 else "not",
        image_exists = file_exists,
        time = current_time,
        pk = pk,
    )


def render_delete_image(pk: int):
    print("pk =", pk, "; pk + 1 =", pk + 1)
    
    test_pk = flask.request.args.get("test_pk")
    test_name = False
    
    try:
        test_name = Test.query.get(int(test_pk)).title_test
    except:
        pass
    print("test_pk =", test_pk, "test_name =", test_name)

    if test_name:
        images_tests_dir = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests", test_name))
        deletion_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "user_tests", test_name, str(pk + 1)))
    else:
        images_tests_dir = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests"))
        deletion_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1)))

    shutil.rmtree(deletion_path)
    folders = [entry for entry in os.scandir(images_tests_dir) if entry.is_dir()]
    folders_sorted = sorted(folders, key=lambda f: int(f.name))

    for folder in folders_sorted:
        folder_num = int(folder.name)
        if folder_num > pk + 1:
            src = os.path.join(images_tests_dir, folder.name)
            dst = os.path.join(images_tests_dir, str(folder_num - 1))
            print(f"Renaming {src} → {dst}")
            os.rename(src, dst)
    return "Delete"

def render_delete_only_image(pk: int):
    print("pk =", pk, "; pk + 1 =", pk + 1)
    
    test_pk = flask.request.args.get("test_pk")
    test_name = False
    
    try:
        test_name = Test.query.get(int(test_pk)).title_test
    except:
        pass
    print("test_pk =", test_pk, "test_name =", test_name)

    if test_name:
        deletion_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "user_tests", test_name, str(pk + 1)))
    else:
        deletion_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1)))

    file_list = os.listdir(deletion_path)
    for file in file_list:
        os.remove(os.path.join(deletion_path, file))

    return "Delete"