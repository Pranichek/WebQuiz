import flask, flask_login, os, random, shutil, traceback, random
from .models import User
from Project.db import DATABASE
from .send_email import send_code, generate_code
from threading import Thread
from quiz.models import Test
from online_passing.models import Rooms
from userprofile.models import DataUser
from Project.login_check import login_decorate
from flask_login import current_user
from Project.check_room import check_room


#Просто головна сторінка
def render_home():
    flask.session["code"] = ''
    if flask.request.method == "POST":
        input_code = flask.request.form.get("input_room")

        room = Rooms.query.filter_by(room_code = input_code).first()
            
        if room:
            flask.session["room_code"] = input_code
            return flask.redirect("/input_username")

    if not current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "home.html", 
            home_page = True
        )
    else:
        return flask.redirect("/home_auth")
    


def get_random_tests(category=None, max_tests=4):
    """
    Отримує випадкові `max_tests` тестів з категорі
    Якщо category не вказано, вибирає з усіх
    """
    if category:
        all_tests = Test.query.filter(Test.category == category, Test.check_del != "deleted").all()
    else:
        all_tests = Test.query.filter(Test.check_del != "deleted").all()

    if not all_tests:
        return []

    # перемешиваем список чтобы выдавало рандомные тесты
    random.shuffle(all_tests)
    return all_tests[0:5]

#головна сторінка коли користувач увійшов у акаунт
@login_decorate
@check_room
def render_home_auth():   
    room = flask_login.current_user.room
    if room and room.room_code != "":
        room.room_code = ""
        DATABASE.session.commit()

    if flask.request.method == "POST":
        check_value = flask.request.form.get("check_form")

        if check_value == "filter":
            return flask.redirect("/filter_page")
        elif check_value == "enter-room":
            data_code = flask.request.form["enter-code"]

            room = Rooms.query.filter_by(room_code = data_code).first()
            
            if room:
                return flask.redirect(f"student?room_code={data_code}")


        
    user = User.query.get(flask_login.current_user.id)

    # отримати баланс
    money_user = user.user_profile.count_money

    category = ["хімія", "англійська", "математика", "історія", "програмування", "фізика", "інше"]
    

    first_topic = random.choice(category)
    category.remove(first_topic)
    first_four_test = get_random_tests(category=first_topic)


    second_topic = random.choice(category)
    category.remove(second_topic)
    second_four_test = get_random_tests(category=second_topic)


    user : User = User.query.get(int(current_user.id))
    third_random_numbers = user.user_profile.last_passed.split(" ")
    for el in third_random_numbers:
        indx = third_random_numbers.index(el)
        normal = el.split("/")[0]
        third_random_numbers[indx] = normal

    # list(set(third_random_numbers))
    for element in third_random_numbers:
        if third_random_numbers.count(element) >= 2:
            count = third_random_numbers.count(element)
            for i in range(count - 1):
                third_random_numbers.remove(element)

    random.shuffle(third_random_numbers)
    all_tests = Test.query.all()

    third_ready_tests = []

    if '' in third_random_numbers:
        third_random_numbers.remove('')
    
    if len(third_random_numbers) >= 5:
        range_count = 5
    else:
        range_count = len(third_random_numbers)

    
    for test in range(0, range_count - 1):
        
        if Test.query.get(int(third_random_numbers[test])).check_del != "deleted" and Test.query.get(int(third_random_numbers[test])) not in third_ready_tests:
            third_ready_tests.append(Test.query.get(int(third_random_numbers[test])))


    fourth_topic = random.choice(category)
    fourth_four_test = get_random_tests(category= fourth_topic)



    return flask.render_template(
        "home_auth.html", 
        home_auth = True,
        count_tests = 0,
        user = user,
        first_tests = first_four_test,
        first_topic = first_topic,
        second_topic = second_topic,
        second_tests = second_four_test,
        third_tests = third_ready_tests if len(third_ready_tests) >= 4 else fourth_four_test,
        fourt_topic = ["Недавно пройдені тести", fourth_topic] if len(third_ready_tests) >= 4 else [f"Тести із теми {fourth_topic}", fourth_topic]
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
        message = message,
        random_num = random.randint(1, 5)
    )


def is_admin(function: object) -> float: # функція що приймає параметри для редіректу на сторінку
    def handler(*args, **kwargs): # Функція обробник фунції параметру із wrapper
        try:
            if function:
                function(*args, **kwargs)
        except Exception as ERROR:
            traceback.print_exc()
        finally:
            return flask.redirect('/verify_code')
    return handler

@is_admin
def clear_code():
    """
    Функція для очищення коду підтвердження.
    Викликається при натисканні на кнопку "надіслати знову".
    """
    random_code = generate_code()
    flask.session["code"] = random_code
    flask.session["count_email"] = 0
    email = Thread(target = send_code, args = (flask.session["email"], flask.session["code"]))
    email.start()

def render_code():
    form_code = ''
    if flask.request.method == "POST":
        send_again = flask.request.form.get("again")
        end_code = flask.request.form.get("end")


        if end_code != "clear":

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
                    avatar = f"default_avatar{random.randint(1,5)}.svg"
                    user = User(
                            username = flask.session["username"],
                            password = flask.session["password"],
                            email = flask.session["email"],
                            is_mentor = flask.session["check_mentor"],
                            name_avatar = avatar
                        )
                    
                    profile = DataUser()
                    user.user_profile = profile
                    
                    #створює папку із тим шляхом що указали
                    path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask.session["email"])))
                    if not os.path.exists(path):
                        os.mkdir(path)

                        default_avatar_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", avatar))

                        destination_path = os.path.join(path, avatar)

                        shutil.copyfile(default_avatar_path, destination_path)

                    DATABASE.session.add(user)
                    DATABASE.session.commit()

                    flask_login.login_user(user)
                    flask.session["code"] = ''
                    flask.session["email_sent"] = False
                else:
                    print(str(flask.session["code"]))
                    print(form_code)
                    print("-------------------------------------------------")
                    flask.session["code"] = ''
                    flask.session["email_sent"] = False
                    return flask.redirect("/")
                
    if not flask_login.current_user.is_authenticated or "new_email" in flask.session:
        return flask.render_template(template_name_or_list = "verify_code.html", code = 34, code1 = flask.session["code"], verify_code_page = True) 
    else:
        flask.session.pop("new_email", "code")
        return flask.redirect("/")




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
                user = User.query.filter_by(email=email_form).first()
                if user is None:
                    email = "shake"
                    message = 'Користувача із такою поштою не існує'
                elif user.password != password_form:
                    password = "shake"
                    message = 'Введений пароль не підходить до пошти'
                else:
                    flask_login.login_user(user)
                    return flask.redirect("/") 
                
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
            message = message,
            random_num = random.randint(1, 5)
            )
    else:
        return flask.redirect("/")
