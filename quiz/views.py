'''
    ?%? між питаннями 
    ?#? між часом проходження різних питань
    ?@? між відповідями на різні питання
    ?&? між картинками
    ?$? між типами питаннь
    (?%+...+%?) правильна відповідь
    (?%-...-%?) неправильна відповідь

    Запис + та - для відповідей у JavaScript
'''

import flask, os, flask_login, shutil
from .models import Test, TestData
from Project.db import DATABASE
from os.path import abspath, join, exists
from flask_login import current_user
from online_passing.del_files import delete_files_in_folder
from .generate_image import return_img
from Project.login_check import login_decorate
from home.models import User
from Project.socket_config import socket

@login_decorate
def render_test():
    list_to_template = []
    new_questions = ""
    new_answers = ""
    category = ""
    name_image = ''
    new_types_questions = ""
    try:
        new_questions = flask.request.cookies.get("questions").encode('raw_unicode_escape').decode('utf-8')
        new_answers = flask.request.cookies.get("answers").encode('raw_unicode_escape').decode('utf-8')
        new_types_questions = flask.request.cookies.get("typeQuestions").encode('raw_unicode_escape').decode('utf-8')
        category = flask.request.cookies.get("category").encode('raw_unicode_escape').decode('utf-8')
        name_image = flask.request.cookies.get("test_url").encode('raw_unicode_escape').decode('utf-8')
    except:
        pass

    cookie_questions = flask.request.cookies.get("questions")
    answers_cookies = flask.request.cookies.get("answers")

    if cookie_questions == None or answers_cookies == None:
        images_directory = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests"))
        if exists(images_directory):
            shutil.rmtree(path= images_directory)



    if flask.request.method == "POST":
        check_form = flask.request.form.get('check_post')

        cookie_questions = flask.request.cookies.get("questions")
        answers_cookies = flask.request.cookies.get("answers")

        


        if check_form == "create_test" and cookie_questions is not None and answers_cookies is not None:
            test_title = flask.request.form["test_title"]
            question_time = flask.request.cookies.get("time").encode('raw_unicode_escape').decode('utf-8')

            len_questions = len(cookie_questions.split("?%?"))

            images_directory = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests"))

            max = int(os.listdir(images_directory)[0])

            for path in os.listdir(images_directory):
                if int(path) > max:
                    max = int(path)

            if exists(images_directory):
                images = os.listdir(images_directory)
                if len_questions < max:
                    for i in range(len_questions, len_questions + (max - len_questions)):
                        if exists(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(i + 1)))):
                            shutil.rmtree(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(i + 1))))


            test = Test(
                title_test = test_title,
                questions = new_questions,
                type_questions = new_types_questions,
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

            from_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests"))
            if exists(from_path):
                for dir in os.listdir(from_path):
                    folder_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", dir))
                    to_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests", test_title))
                    shutil.move(folder_path, to_path)


                from_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests"))
                to_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests"))
                if len(os.listdir(from_path)) > 0:
                    shutil.move(from_path, to_path)


            if "test_image" in flask.session and flask.session["test_image"] != "default":
                source_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar",
                                        str(current_user.email), "cash_test", flask.session["test_image"]))
                dest_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar",
                                        str(current_user.email), "user_tests", str(test_title), flask.session["test_image"]))

                shutil.copy(src=source_path, dst=dest_path)
                os.remove(source_path)

            if "test_image" in flask.session:
                flask.session.pop("test_image", None)

            DATABASE.session.add(test)
            DATABASE.session.commit()
            return response
        elif check_form == "image":
            image = flask.request.files["image"]

            if image:
                if not exists(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "cash_test"))):
                    os.mkdir(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "cash_test")))

                flask.session["test_image"] = str(image.filename)
                delete_files_in_folder(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "cash_test")))

                image.save(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "cash_test", str(image.filename))))
        elif check_form == "del_image":
            flask.session["test_image"] = "default"
    
    types = new_types_questions.split("?$?")
    new_answers_list = ''
    if new_questions:
        new_answers_list = new_answers.split("?@?")
        new_questions_list = new_questions.split("?%?")

        number = 0
        for question in new_questions_list:
            try:
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
                item["type_question"] = types[number]
                list_to_template.append(item)
                number += 1
            except:
                pass


    # получение картинок к тесту(и к вопросу и к ответу)
    img_lists = []
    count_questions = new_questions.count("?%?") + 1
    for index in range(count_questions):
        if count_questions <= len(list_to_template):
            small_list = ["not" for index in range(len(list_to_template[index]["answers"]) + 1)]


            check_img = False

            path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "images_tests", str(index + 1)))
            if exists(path):
                name_img = None
                for small_path in os.listdir(path):
                    if small_path not in ["1", "2", "3", "4"]:
                        name_img = small_path
                        break            
            else:
                name_img = None


            if name_img:
                img_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{flask_login.current_user.email}/images_tests/{index + 1}/{name_img}")
            else:
                img_url = "not"

            small_list[0] = img_url
            # check the images for answers(tipo lol)

            range_len = len(list_to_template[index]["answers"]) + 1
            for index_answ in range(1, range_len):
                path = abspath(join(__file__, "..", "..", 
                        "userprofile", "static", "images", "edit_avatar", 
                        str(flask_login.current_user.email), "images_tests",
                        str(index + 1), str(index_answ)))
                
                if exists(path):                
                    answer_url = flask.url_for("profile.static", filename = f"images/edit_avatar/{flask_login.current_user.email}/images_tests/{index + 1}/{index_answ}/{os.listdir(path)[0]}")

                    small_list[index_answ] = answer_url

            img_lists.append(small_list)
    
    return flask.render_template(
        template_name_or_list= "test.html", 
        create_test = True,
        question_list = list_to_template,
        user = flask_login.current_user,
        cash_image = flask.session["test_image"] if "test_image" in flask.session and flask.session["test_image"] != "default" else "default",
        img_lists = img_lists
    )

@login_decorate
def render_create_question():
    if flask.request.method == "POST":
        image = flask.request.files["image"]

        image_answers = []
        img_answer1 = flask.request.files["image1"]
        img_answer2 = flask.request.files["image2"]
        img_answer3 = flask.request.files["image3"]
        img_answer4 = flask.request.files["image4"]
        image_answers.extend([img_answer1, img_answer2, img_answer3, img_answer4])

        questions_cookie = flask.request.cookies.get("questions")

        if questions_cookie:
            questions_list = list(filter(None, questions_cookie.split("?%?")))
            question_number = len(questions_list)

        
        path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(question_number)))

        if not exists(path):
            os.makedirs(path)
        
        if image:
            image.save(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(question_number), str(image.filename))))

        path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(question_number)))
        if not exists(path):
            os.mkdir(path=path)

        questions_types = flask.request.cookies.get("typeQuestions").encode('raw_unicode_escape').decode('utf-8')
        current_type = questions_types.split("?$?")[-1]
        if (current_type == "one-answer" or current_type == "many-answers"):
            for image in image_answers:
                if image:
                    path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(question_number) , str(image_answers.index(image) + 1)))

                    if not exists(path):
                        os.mkdir(path)

                    image.save(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(question_number) , str(image_answers.index(image) +1 ), str(image.filename))))
                               
        
        return flask.redirect("/test")

    return flask.render_template(template_name_or_list= "create_question.html", create_test = True)

@login_decorate
def render_select_way():
    return flask.render_template(
        template_name_or_list = "select_way.html",
        create_test = True
    )

@login_decorate
def render_change_question(pk: int):
    if flask.request.method == "POST":
        questions_types = flask.request.cookies.get("typeQuestions").encode('raw_unicode_escape').decode('utf-8')
        current_type = questions_types.split("?$?")[pk]

        if (current_type == "input-gap"):
            dir_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1)))
            if exists(dir_path):
                for dir in os.listdir(dir_path):
                    if dir in ["1", "2", "3", "4"]:
                        current_dir = join(dir_path, dir)
                        shutil.rmtree(current_dir)
            else:
                os.mkdir(dir_path)


        # загруженные картинки
        image_answers = []
        img_answer1 = flask.request.files["image1"]
        img_answer2 = flask.request.files["image2"]
        img_answer3 = flask.request.files["image3"]
        img_answer4 = flask.request.files["image4"]
        image_answers.extend([img_answer1, img_answer2, img_answer3, img_answer4])

        # проврека на загруженную картинку
        check_lists = []
        check1 = flask.request.form["check1"]
        check2 = flask.request.form["check2"]
        check3 = flask.request.form["check3"]
        check4 = flask.request.form["check4"]
        check_lists.extend([check1, check2, check3, check4])

        check_del = flask.request.form["check5"].split()
        dir_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1)))
        files = os.listdir(dir_path)
        index_change = [1, 2, 3, 4]

        for i in range(len(check_del)):
            check_del[i] = int(check_del[i])
        
        check_del.sort()

        for del_id in check_del:
            if str(del_id) in os.listdir(dir_path):
                for i in range(del_id - 1, len(check_del)):
                    del index_change[i]
                cur_dir = join(dir_path, str(del_id))
                shutil.rmtree(path=cur_dir)

        
        
        for index in range(len(image_answers)):
            image = image_answers[index]
            flag = check_lists[index]
            
            if image and str(index + 1) not in check_del:
                path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1) , str(image_answers.index(image) + 1)))

                if not exists(path):
                    os.mkdir(path)
                else:
                    if len(os.listdir(path)) > 0:
                        for filename in os.listdir(path):
                            file_path = join(path, filename)
                            os.remove(file_path)

                
                if flag != "delete":
                    image.save(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1) , str(image_answers.index(image) +1 ), str(image.filename))))
            else:
                if flag == "delete":
                    path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1), str(index + 1)))
                    if exists(path):
                        shutil.rmtree(path=path)

        check_del = flask.request.form["check5"].split()
        for i in range(len(check_del)):
            check_del[i] = int(check_del[i])
            
        # изменение название папко где хранятся кратинки если пользователь удалил блок  ответом
        rename_dir = [1, 2, 3, 4]
        for el in rename_dir[:]:  
            if el in check_del:
                rename_dir.remove(el)
 

        for i in range(1, len(rename_dir) + 1):
            index = rename_dir[i - 1]
            if str(index) in os.listdir(dir_path):
                cur_path = join(dir_path, str(index))
                os.rename(cur_path, join(dir_path, str(i)))
        

        image = flask.request.files["image"]
        if image:
            dir_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1)))
            for filename in os.listdir(dir_path):
                file_path = join(dir_path, filename)
                try:
                    os.unlink(file_path)
                except Exception as e:
                    print(f"Failed to delete {file_path}. Reason: {e}")
            try:
                image.save(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1), str(image.filename))))
            except Exception as e:
                print("saving image error:", e)

            


        return flask.redirect("/test")
    
    else:
        questions = flask.request.cookies.get("questions").encode('raw_unicode_escape').decode('utf-8')
        answers = flask.request.cookies.get("answers").encode('raw_unicode_escape').decode('utf-8')
        question_time = flask.request.cookies.get("time").encode('raw_unicode_escape').decode('utf-8')
        questions_types = flask.request.cookies.get("typeQuestions").encode('raw_unicode_escape').decode('utf-8')

        # current_image = images.split("?&?")[pk]
        current_question = questions.split("?%?")[pk]
        current_time = question_time.split("?#?")[pk]
        current_answers = answers.split("?@?")[pk]
        current_type = questions_types.split("?$?")[pk]
        answers_list = current_answers.split("%?)(?%")
        
        answers = []

        correctAnswers = []
        if current_type == "one-answer" or current_type == "many-answers":
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
        elif current_type == "input-gap":
            for answer in answers_list:
                answer = answer.replace("(?%", "")
                answer = answer.replace("%?)", "")
                if (len(answer) > 0):
                    if answer[0] == "+":
                        correctAnswers.append("correct")
                    else:
                        correctAnswers.append("not")
                    answer = answer[1:-1]
                    answers.append(answer)



    image_question = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1)))
    exists_image = False

    image_url = None
    if exists(image_question):
        if len(os.listdir(image_question)) > 0:
            for image in os.listdir(image_question):
                if image not in ["1", "2", "3", "4"]:
                    exists_image = True
                    image_url = join("userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1), image)


    list_checks = []
    list_checks.extend(["load", "load", "load", "load"])
    list_urls = ["none", "none", "none", "none"]
    path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1)))

    for i in range(1, 5):
        current_path = join(path, str(i))
        if exists(current_path):
            list_checks[i - 1] = "delete"
            check_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1), str(i)))
            if len(os.listdir(check_path)) > 0:
                url = flask.url_for('profile.static', filename=join("images", "edit_avatar", str(current_user.email), "images_tests", str(int(pk) + 1), str(i), os.listdir(current_path)[0])) if len(os.listdir(current_path)) > 0 else False
                list_urls[i - 1] = url
            else:
                shutil.rmtree(path=check_path)

    

    return flask.render_template(
        template_name_or_list = "change_question.html",
        question = current_question,
        answer1 = answers[0] if len(answers) > 0 else "",
        answer2 = answers[1] if len(answers) > 1 else "",
        answer3 = answers[2] if len(answers) > 2 else "",
        answer4 = answers[3] if len(answers) > 3 else "",
        answers_gap = answers,
        correct1 = correctAnswers[0] if len(correctAnswers) > 0 else "",
        correct2 = correctAnswers[1] if len(correctAnswers) > 1 else "",
        correct3 = correctAnswers[2] if len(correctAnswers) > 2 else "not",
        correct4 = correctAnswers[3] if len(correctAnswers) > 3 else "not",
        time = current_time,
        pk = pk,
        exists_image = exists_image,
        image_url = image_url,
        current_type = current_type,
        list_checks = list_checks,
        list_urls = list_urls,
        create_test = True
    )

@socket.on("delImage")
def del_image(data):
    index_question = int(data["pk"]) + 1
    user_diresctory = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(index_question)))
    if exists(user_diresctory):
        if len(os.listdir(user_diresctory)) > 0:
            for file in os.listdir(user_diresctory):
                file_path = join(user_diresctory, file)
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"ошибка при удалении картинки")


def render_delete_image(pk: int):    
    test_name = None
    test_pk = flask.request.args.get("test_pk")
    test_name = False
    
    try:
        test_name = Test.query.get(int(test_pk)).title_test
    except:
        pass
    print("test_pk =", test_pk, "test_name =", test_name)

    if test_name:
        images_tests_dir = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "user_tests", test_name))
        deletion_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "user_tests", test_name, str(pk + 1)))
    else:
        images_tests_dir = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests"))
        deletion_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1)))

    shutil.rmtree(deletion_path)
    folders = [entry for entry in os.scandir(images_tests_dir) if entry.is_dir()]
    folders_sorted = sorted(folders, key=lambda f: int(f.name))

    for folder in folders_sorted:
        folder_num = int(folder.name)
        if folder_num > pk + 1:
            src = join(images_tests_dir, folder.name)
            dst = join(images_tests_dir, str(folder_num - 1))
            print(f"Renaming {src} → {dst}")
            os.rename(src, dst)
    return "Delete"


def render_delete_only_image(pk: int):
    test_pk = flask.request.args.get("test_pk")
    test_name = False
    
    try:
        test_name = Test.query.get(int(test_pk)).title_test
    except:
        pass
    print("test_pk =", test_pk, "test_name =", test_name)

    if test_name:
        deletion_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "user_tests", test_name, str(pk + 1)))
    else:
        deletion_path = abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "images_tests", str(pk + 1)))

    file_list = os.listdir(deletion_path)
    for file in file_list:
        os.remove(join(deletion_path, file))

    return "Delete"


@login_decorate
def render_import_test():
    return flask.render_template(
        template_name_or_list = "import_test.html",
        create_test = True
    )


@login_decorate
def render_change_tests():
    user = User.query.get(flask_login.current_user.id)
    message = ''
    
    test_id = flask.request.args.get("test_id")
    if not test_id:
        return 

    test = Test.query.filter_by(id=test_id, user_id=user.id).first()
    if not test:
        return 
    if flask.request.method == "POST":
        new_name = flask.request.form.get("new_name")
        if new_name:
            existing_test = Test.query.filter_by(user_id=user.id, title_test=new_name).first()
            if existing_test:
                message = "Тест із такою назвою вже є"
            else:
                old_path = abspath(join(__file__, "..", "static", "images", "edit_avatar", str(user.email), "user_tests", str(test.title_test)))
                new_path = abspath(join(__file__, "..", "static", "images", "edit_avatar", str(user.email), "user_tests", str(new_name)))
                os.rename(old_path, new_path)
                test.title_test = new_name
                DATABASE.session.commit()
                message = "Назву змінено успішно"

        delete_id = flask.request.form.get("delete-id")
        if delete_id:
            test.check_del = "deleted"
            DATABASE.session.commit()
            message = "Тест видалено"
            return flask.redirect("/user_test")

        create_room = flask.request.form.get("create-room")


    
    return flask.render_template(
        "change_tests.html",
        test=test,
        message=message,
        create_test = True
    )