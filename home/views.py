import flask, flask_login, os, random, shutil
from .models import User
from Project.db import DATABASE
from .send_email import send_code, generate_code
from threading import Thread
import PIL
from quiz.models import Test
from userprofile.models import DataUser
from Project.login_check import login_decorate
from flask_login import current_user

from Project.check_pet import cheker_for_pets

#Просто головна сторінка
def render_home():
    flask.session["code"] = ''
    if not current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "home.html", 
            home_page = True
        )
    else:
        return flask.redirect("/home_auth")
    
#головна сторінка коли користувач увійшов у акаунт
@login_decorate
def render_home_auth():    
    user = User.query.get(flask_login.current_user.id)

    # отримати баланс
    money_user = user.user_profile.count_money
    print(money_user, "money")

    # щоб в майбутньому додавати монети після проходження тесту (?????)
    # if flask.request.args.get("bonus") == "true":
    #     user.user_profile.count_money += 20
    #     DATABASE.session.commit()

    # змінити баланс
    # user.user_profile.count_money = 270
    # DATABASE.session.commit()

    category = ["хімія", "англійська", "математика", "історія", "програмування", "фізика", "інше"]
    first_topic = random.choice(category)
    category.remove(first_topic)
    second_topic = random.choice(category)

    first_four_test = []
    random_numbers = []

    if flask.request.method == "POST":
        check_value = flask.request.form.get("check_form")

        if check_value == "filter":
            return flask.redirect("/filter_page")
        elif check_value == "enter-room":
            data_code = flask.request.form["enter-code"]
            return flask.redirect(f"student?room_code={data_code}")

    tests_first_topic = Test.query.filter(Test.category == first_topic, Test.check_del != "deleted").all()
    if len(tests_first_topic) > 0:
        while True:
            random_num = random.randint(0, len(tests_first_topic) - 1)
            if random_num not in random_numbers and tests_first_topic[random_num].check_del != "deleted":
                random_numbers.append(random_num)
            if len(random_numbers) == len(tests_first_topic) or len(random_numbers) >= 4:
                break
        print(random_numbers)
        for num in random_numbers:
            first_four_test.append(tests_first_topic[num])

    second_four_test = []
    second_random_numbers = []

    # tests_second_topic = Test.query.filter_by(category = second_topic).all()
    tests_second_topic = Test.query.filter(Test.category == second_topic, Test.check_del != "deleted").all()
    if len(tests_second_topic) > 0:
        while True:
            random_num = random.randint(0, len(tests_second_topic) - 1)
            if random_num not in second_random_numbers and tests_second_topic[random_num].check_del != "deleted":
                second_random_numbers.append(random_num)
            if len(second_random_numbers) == len(tests_second_topic) or len(second_random_numbers) >= 4:
                break
        for num in second_random_numbers:
            second_four_test.append(tests_second_topic[num])


    user : User = User.query.get(int(current_user.id))
    third_random_numbers = user.user_profile.last_passed.split(" ")
    all_tests = Test.query.all()

    third_ready_tests = []

    if '' in third_random_numbers:
        third_random_numbers.remove('')
    for test in range(0, len(third_random_numbers)):
        if Test.query.get(int(third_random_numbers[test])).check_del != "deleted":
            third_ready_tests.append(Test.query.get(int(third_random_numbers[test])))

    # id_user = User.query.get(id_user)
    # if cheker_for_pets(id_user = id_user) == "" or cheker_for_pets(id_user = id_user) == None:
    #     return None
    # else:
    #     pet = cheker_for_pets(id_user = id_user)

    pet_id = cheker_for_pets(user.id)


    return flask.render_template(
        "home_auth.html", 
        home_auth = True,
        count_tests = 0,
        user = user,
        first_tests = first_four_test,
        first_topic = first_topic,
        second_topic = second_topic,
        second_tests = second_four_test,
        third_tests = third_ready_tests,

        pet_id = pet_id,
        )

    

def render_registration():
    # try:
    email_shake = ''
    password_shake = ''
    phone_shake = ''
    message = ''
    flask.session["count_email"] = 0
    if flask.request.method == "POST":
        check_form = flask.request.form.get("check_form")
        if check_form == "registration":
            username_form = flask.request.form["username"]


            email_form = flask.request.form["email"]
            # phone_number_form = flask.request.form["phone_number"]
            mentor_form = flask.request.form["mentor"]

            password_form = flask.request.form["password"]
            confirm_password = flask.request.form["confirm-password"]
            if password_form == confirm_password and len(password_form) == 8:
                if User.query.filter_by(email = email_form).first() is None:
                    # if User.query.filter_by(phone_number = phone_number_form).first() is None:
                    is_mentor = None
                    if mentor_form == 'True':
                        is_mentor = True
                    else:
                        is_mentor = False
                    random_code = generate_code()

                    flask.session["count_email"] += 1
                    flask.session["code"] = random_code
                    flask.session["email"] = email_form
                    flask.session["username"] = username_form
                    flask.session["check_mentor"] = is_mentor
                    flask.session["password"] = password_form

                    email = Thread(target = send_code, args = (email_form, flask.session["code"]))
                    email.start()
                    
                    return flask.redirect("/verify_code")
                else:
                    flask.session.clear()
                    email_shake = "User already exists"
                    message = "Користувач із такою поштою вже існує"
            else:
                flask.session.clear()
                password_shake = "Password is not eqal each other"
                message = "Введені паролі не співпадають"
        elif check_form == "clear_form":
            print("da?")
            email_shake = ''
            password_shake = ''
            phone_shake = ''
            message = ''
            
    return flask.render_template(
        template_name_or_list = "registration.html", 
        email_shake = email_shake, 
        registration_page = True,
        password_shake = password_shake,
        phone_shake = phone_shake,
        message = message
    )
    # except Exception as error:
    #     print(error)
    #     flask.session.clear()
    #     return flask.redirect("/")


def render_code():
    # try:
        form_code = ''
        if flask.request.method == "POST":
            for num_tag in range(1, 7):
                data = str(flask.request.form[f"verify_code{num_tag}"])
                form_code += data
            if "new_email" in flask.session:
                if str(flask.session["code"]) == form_code:
                    flask_login.current_user.email = flask.session["new_email"]
                    DATABASE.session.commit()
                    flask.session.pop("new_email", "code")
                    old_name_folder = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile" "static", "images", "edit_avatar", str(flask_login.current_user.email)))
                    new_name_folder = os.path.abspath(os.path.join(__file__, "..",  "..", "userprofile", "static", "images", "edit_avatar", str(flask.session["new_email"])))
                    os.rename(old_name_folder, new_name_folder)
                    return flask.redirect("/")
            else:
                if form_code != '':
                    if str(flask.session["code"]) == form_code:
                        user = User(
                                username = flask.session["username"],
                                password = flask.session["password"],
                                email = flask.session["email"],
                                is_mentor = flask.session["check_mentor"]
                            )
                        
                        profile = DataUser()
                        user.user_profile = profile
                        
                        #створює папку із тим шляхом що указали
                        path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask.session["email"])))
                        if not os.path.exists(path):
                            os.mkdir(path)

                            default_avatar_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", "default_avatar.svg"))

                            destination_path = os.path.join(path, "default_avatar.svg")

                            shutil.copyfile(default_avatar_path, destination_path)

                        DATABASE.session.add(user)
                        # DATABASE.session.add(profile)
                        DATABASE.session.commit()
                        flask_login.login_user(user)
                        flask.session["code"] = ''
                        flask.session["email_sent"] = False
                    else:
                        flask.session["code"] = ''
                        flask.session["email_sent"] = False
                        return flask.redirect("/")
                    
        if not flask_login.current_user.is_authenticated or "new_email" in flask.session:
            return flask.render_template(template_name_or_list = "verify_code.html") 
        else:
            flask.session.pop("new_email", "code")
            print(8237823788787)
            return flask.redirect("/")
    # except Exception as error:
    #     print(error)
    #     flask.session.clear()
    #     return flask.redirect("/")


def render_login():
    password = ''
    email = ''
    message = ''
    if flask.request.method == "POST":
        check_form = flask.request.form.get("check_form")

        if check_form == "login":
            email_form = flask.request.form["email"]
            password_form = flask.request.form["password"]
            list_users = User.query.all()
            if User.query.filter_by(email = email_form).first() is None:
                email = "shake"
                message = 'Користувача із такою поштою не існує'
            else:
                for user in list_users:
                    if user.email == email_form:
                        if user.password == password_form:
                            flask_login.login_user(user)
                        else:
                            password = "shake"
                            message = 'Введений пароль не підходить до пошти'
        elif check_form == "clear_form":
            password = ''
            email = ''
            message = ''

    if not flask_login.current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "login.html", 
            login_page = True,
            password = password,
            email = email,
            message = message
            )
    else:
        return flask.redirect("/")

