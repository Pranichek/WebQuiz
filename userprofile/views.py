import flask, os, flask_login, random, shutil
from threading import Thread
import PIL.Image
from home.models import User
from quiz.models import Test, TestData
from online_passing.del_files import delete_files_in_folder
from quiz.generate_image import return_img
from Project.db import DATABASE
from .render_data import create_email, render_phone_number
from home.send_email import send_code, generate_code 
from Project.login_check import login_decorate
from os.path import abspath, join, exists
from Project.check_room import check_room
from flask_login import current_user


@login_decorate
def render_profile():
    user = flask_login.current_user
    if flask.request.method == "POST":
        check_form = flask.request.form.get("form_name")

        if check_form == "change_name":
            if flask.request.form["new_name"] != (None or "none" or "" or " "):
                if any(symbol.isdigit() for symbol in flask.request.form["new_name"]) == False:
                    user.username = flask.request.form["new_name"]
                    DATABASE.session.commit()

        elif check_form == "change_phone":
            if User.query.filter_by(phone_number = flask.request.form["new_phone"][1:]).first() is None:
                # проверка на наличие цифр в строке
                if flask.request.form["new_phone"][1:].isdigit() and len(flask.request.form["new_phone"][1:]) == 12:
                    user.phone_number = flask.request.form["new_phone"]
                    DATABASE.session.commit()

        elif check_form == "change_password":
            if flask.request.form["current_password"] == flask_login.current_user.password:
                if flask.request.form["new_password"] == flask.request.form["confirm_password"]:
                    user.password = flask.request.form["new_password"]
                    DATABASE.session.commit()
        elif check_form == "change_email_user":
            if User.query.filter_by(email =flask.request.form["new_email"]).first() is None:
                code = generate_code()
                flask.session["code"] = code
                flask.session["new_email"] = flask.request.form["new_email"]
                # send_code(recipient = flask.request.form["new_email"], code = int(flask.session["code"]))
                email = Thread(target = send_code, args = (str(flask.request.form["new_email"]), flask.session["code"]))
                email.start()
                return flask.redirect("/verify_code")

        elif check_form == "logout":
            flask.session.clear()
            return flask.redirect("/")
        
        elif check_form == "delete":
            user = User.query.get(flask_login.current_user.id)
            #удаляем папку с его медиа файлами
            if os.path.exists(os.path.abspath(os.path.join(__file__, "..", "static", "images", "edit_avatar", str(user.email)))):
                shutil.rmtree(os.path.abspath(os.path.join(__file__, "..", "static", "images", "edit_avatar", str(user.email))))
            user.email = "Deleted"
            user.phone_number = "Deleted"

            for test in user.tests.all():
                test.check_del = 'deleted'
            
            flask.session.clear()
            # DATABASE.session.delete(user)
            DATABASE.session.commit()
            return flask.redirect("/")

    # if flask_login.current_user.is_authenticated:
    return flask.render_template(
        template_name_or_list = "profile.html",
        email = create_email(flask_login.current_user.email),
        phone_user = render_phone_number(flask_login.current_user.phone_number),
        user = user
    )

    
@login_decorate
def render_edit_avatar():
    # try:
        user = flask_login.current_user
        show = ['']

        if flask.request.method == "POST":
            check_form = flask.request.form.get("check_form")

            if check_form == "load_image":
                if 'file' not in flask.request.files:
                    return flask.redirect("/")
                
                file = flask.request.files["file"]
                user = User.query.get(flask_login.current_user.id)
                if not os.path.exists(os.path.abspath(os.path.join(__file__, "..", "static", "images", 'edit_avatar', str(user.email), "cash"))):
                    os.mkdir(path= os.path.abspath(os.path.join(__file__, "..", "static", "images", 'edit_avatar', str(user.email), "cash")))
                else:
                    if len(os.listdir(os.path.abspath(os.path.join(__file__, "..", "static", "images", 'edit_avatar', str(user.email), "cash")))) > 0:
                        for file_dir in os.listdir(os.path.abspath(os.path.join(__file__, "..", "static", "images", 'edit_avatar', str(user.email), "cash"))):
                            os.remove(path = os.path.abspath(os.path.join(__file__, "..", "static", "images", 'edit_avatar', str(user.email), "cash", file_dir)))

                path_to_avatar = os.path.abspath(os.path.join(__file__, "..", "static", "images", 'edit_avatar', str(user.email), "cash", str(file.filename)))
                if not os.path.exists(path = path_to_avatar):
                    file.save(path_to_avatar)

                flask.session["cash_image"] =  str(file.filename)
                show[0] = 'show'
                # flask_login.current_user.name_avatar = str(file.filename)
                # DATABASE.session.commit()
            elif check_form == "apply_image":
                try:
                    show[0] = ''
                    flask_login.current_user.name_avatar = flask.session["cash_image"]

                    data_range = int(flask.request.form.get("hide-size"))

                    if data_range <= 140:
                        flask_login.current_user.size_avatar = 110 + int(data_range)
                    else:
                        flask_login.current_user.size_avatar = 155 + int(data_range)
                    DATABASE.session.commit()

                    img = PIL.Image.open(fp = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "cash", str(flask.session["cash_image"]))))

                    img = img.save(fp = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email) , str(flask.session["cash_image"]))))
                    os.remove(path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "cash", str(flask.session["cash_image"]))))
                except Exception as error:
                    pass
            elif check_form == "defaul_avatar":
                number_avatar = flask.request.form.get("data_avatar")

                name_avatar = ''

                if number_avatar == "1":
                    name_avatar = "default_avatar1.svg"
                elif number_avatar == "2":
                    name_avatar = "default_avatar2.svg"
                elif number_avatar == "3":
                    name_avatar = "default_avatar3.svg"
                elif number_avatar == "4":
                    name_avatar = "default_avatar4.svg"
                elif number_avatar == "5":
                    name_avatar = "default_avatar5.svg"

                flask_login.current_user.size_avatar = 100
                default_img_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", name_avatar))
                user_img_dir = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email)))
                user_img_path = os.path.join(user_img_dir, name_avatar)

                # создаем директорию, если ее нет
                if not os.path.exists(user_img_dir):
                    os.makedirs(user_img_dir)

                # копируем файл, если он еще не существует
                if not os.path.exists(user_img_path):
                    shutil.copyfile(default_img_path, user_img_path)

                flask_login.current_user.name_avatar = name_avatar
                DATABASE.session.commit()
            elif check_form == "del_image":
                default_avatars = ["default_avatar.svg", "default_avatar2.svg", "default_avatar3.svg", "default_avatar4.svg","default_avatar5.svg"]
                if str(flask_login.current_user.name_avatar) not in default_avatars:
                    name_default_avatar = str(random.choice(default_avatars))
                    path = os.path.abspath(os.path.join(__file__, "..", "static", "images", "edit_avatar", str(flask_login.current_user.email), name_default_avatar))

                    if not os.path.exists(path):
                        default_img = PIL.Image.open(fp = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", name_default_avatar)))
                        # save a image using extension
                        default_img = default_img.save(fp = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), name_default_avatar)))
                    flask_login.current_user.size_avatar = 100
                    flask_login.current_user.name_avatar = name_default_avatar
                    DATABASE.session.commit()
            
            elif check_form == "back":
                show[0] = ''

                
        return flask.render_template(
            template_name_or_list = "edit_avatar.html",
            user = user,
            show = show[0],
            cash_image = str(flask.session["cash_image"] if 'cash_image' in flask.session else "Nothing")
        )


@check_room
@login_decorate
def render_user_tests():
    
    response = None
    if flask.request.method == "POST":
        delete_test_id = flask.request.form.get("test_id")
        user = User.query.get(flask_login.current_user.id)
        old_favorites = user.user_profile.favorite_tests.split()

        if str(delete_test_id) in old_favorites:
            old_favorites.remove(str(delete_test_id))
            
            user.user_profile.favorite_tests = " ".join(old_favorites)
            DATABASE.session.commit()

    cookie = flask.request.cookies.get("pageindex")
    if cookie == "created":
        user = User.query.get(flask_login.current_user.id)
        tests = user.tests.filter(Test.check_del != "deleted").all()


        response = flask.make_response(
            flask.render_template(
                template_name_or_list="user_tests.html",
                tests = tests,
                user=flask_login.current_user,
                page_name = "Колекція тестів",
            )
        )

    elif cookie == "recently-passed":
        user = User.query.get(flask_login.current_user.id)
        id_tests = user.user_profile.last_passed.split(" ")

        for elem in id_tests:
            if len(elem) > 2:
                current_element = elem.split("/") 
                index_element = id_tests.index(elem)
                current_element.pop(1) 
                current_element.pop(1)
                current_element.pop(1)
                id_tests[index_element] = current_element[0]

    
        tests = []
        all_tests = Test.query.all()

        for id_test in range(0,len(id_tests)):
            old_data = user.user_profile.last_passed.split(" ")
            current_id = id_tests[id_test]

            for test in all_tests:
                if current_id != '':
                    if int(current_id) == int(test.id):
                        tests.append((test, old_data[id_test].split("/")[1], old_data[id_test].split("/")[2], old_data[id_test].split("/")[-1]))


        message = ''

        for test in tests:
            if test[0].check_del != "exists":
                tests.remove(test)

        response = flask.make_response(
            flask.render_template(
                template_name_or_list="user_tests.html",
                last_tests = tests,
                user = flask_login.current_user,
                message = message,
                page_name = "Недавно пройдені тести"
            )
        )

    elif cookie == "saved":
        user : User = User.query.get(flask_login.current_user.id)
        
        tests = []
        favorite_id = user.user_profile.favorite_tests.split()
        all_test = Test.query.filter(Test.check_del != "deleted").all()
        message = ''

        for test in all_test:
            if str(test.id) in favorite_id:
                tests.append(test)

        response = flask.make_response(
            flask.render_template(
                template_name_or_list="user_tests.html",
                saved_tests = tests,
                user=flask_login.current_user,
                message = message,
                page_name = "Мої обрані тести",
            )
        )


    if response != None:
        response.delete_cookie('questions')
        response.delete_cookie('answers')
        response.delete_cookie('time')
        response.delete_cookie('category')
        response.delete_cookie('inputname')
    
    if response != None:
        return response
    else:
        return flask.render_template("user_tests.html")



@login_decorate
def render_test_preview(pk: int):
    new_questions = ""
    new_answers = ""
    category = ""
    if flask.request.cookies.get("questions"):
        new_questions = flask.request.cookies.get("questions").encode('raw_unicode_escape').decode('utf-8')
        new_answers = flask.request.cookies.get("answers").encode('raw_unicode_escape').decode('utf-8')
        category = flask.request.cookies.get("category").encode('raw_unicode_escape').decode('utf-8')
        print("new_questions =", new_questions)

    if flask.request.method == "POST":
        check_form = flask.request.form.get('check_post')

        cookie_questions = flask.request.cookies.get("questions")
        answers_cookies = flask.request.cookies.get("answers")

        if check_form == "create_test" and cookie_questions is not None and answers_cookies is not None:
            test_title = flask.request.form["test_title"]
            question_time = flask.request.cookies.get("time").encode('raw_unicode_escape').decode('utf-8')

            test = Test.query.get(pk)
            print("test =", test)

            test.title_test = test_title
            test.questions = new_questions
            test.answers = new_answers
            test.question_time = question_time
            category = category
            image = flask.session["test_image"] if "test_image" in flask.session and flask.session["test_image"] != "default" else f"default/{return_img(category = category)}"

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

    else:

        response = flask.make_response()
        test = Test.query.get(pk)

        category = test.category.encode('utf-8').decode('unicode_escape')
        print("test =", category)

        list_to_template = []
        # new_questions_list = test.questions.split("?%?")
        # new_answers_list = test.answers.split("?@?")
        # new_time_list = test.question_time.split("?#?")
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
            # item["time"] = new_time_list[number]
            list_to_template.append(item)
            number += 1
        print("list_to_template", list_to_template)

        response = flask.make_response(
            flask.render_template(
                template_name_or_list = "test_preview.html",
                test = test,
                user = flask_login.current_user,
                question_list = list_to_template
            )
        )
        if not flask.request.cookies.get("questions"):
            response.set_cookie('questions', test.questions)
            response.set_cookie('answers', test.answers)
            response.set_cookie('time', test.question_time)
            response.set_cookie('category', category)
            response.set_cookie('inputname', test.title_test)

    return response

@login_decorate
def render_change_question_preview(pk: int, id: int):
    test_name = Test.query.get(pk).title_test
    if flask.request.method == "POST":
        image = flask.request.files["image"]
        if image:
            dir_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "user_tests", test_name, str(id + 1)))
            for filename in os.listdir(dir_path):
                file_path = os.path.join(dir_path, filename)
                try:
                    os.unlink(file_path)
                except Exception as e:
                    print(f"Failed to delete {file_path}. Reason: {e}")
            try:
                image.save(os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "user_tests", test_name, str(id + 1), str(image.filename))))
            except Exception as e:
                print("saving image error:", e)
        return flask.redirect(f"/test_preview/{pk}")
    
    else:
        questions = flask.request.cookies.get("questions").encode('raw_unicode_escape').decode('utf-8')
        answers = flask.request.cookies.get("answers").encode('raw_unicode_escape').decode('utf-8')
        question_time = flask.request.cookies.get("time").encode('raw_unicode_escape').decode('utf-8')

        # current_image = images.split("?&?")[pk]
        current_question = questions.split("?%?")[id]
        current_time = question_time.split("?#?")[id]
        current_answers = answers.split("?@?")[id]
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

    deletion_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "user_tests", test_name, str(id + 1)))
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
        time = current_time,
        pk = id,
        image_exists = file_exists,
        test_pk = pk
    )


@login_decorate
def render_buy_gifts():
    user = flask_login.current_user
    email = flask_login.current_user
    count_money = user.user_profile.count_money
    pet_id = user.user_profile.pet_id

    if flask.request.method == "POST":
        check_form = flask.request.form.get("buy_gift")

        if check_form and "/" in check_form:
            data_button = check_form.split("/")  # [pet_id, cost]
            pet_id = data_button[0]
            pet_cost = int(data_button[1])

            if count_money >= pet_cost:
                # Проверяем, не куплен ли уже питомец
                if str(user.user_profile.pet_id) != str(pet_id):
                    user.user_profile.count_money -= pet_cost
                    user.user_profile.pet_id = pet_id  
                    DATABASE.session.commit()

        # После обработки POST-запроса перенаправляем на ту же страницу (чтобы не было повторной отправки формы)
        # return flask.redirect(flask.url_for("buy_gifts.render_buy_gifts"))

    return flask.render_template(
        template_name_or_list = "buy_gifts.html",
        user = user,
        email = email,
        count_money = count_money,
        pet_id = pet_id
    )

