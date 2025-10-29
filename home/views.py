import flask, flask_login, os, random, shutil, traceback, requests, json, random
from Project.login_manager import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_DISCOVERY_URL, client
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
    list_tests = []
    category = ["хімія", "англійська", "математика", "історія", "програмування", "фізика", "інше", "нещодавно пройдені"]
    random.shuffle(category)
    check_passed = user.user_profile.last_passed.split(" ")
    random.shuffle(check_passed)
    last_passed = check_passed if len(check_passed) <= 5 else check_passed[0:5]

    for category in category:
        if category != "нещодавно пройдені":
            all_tests = Test.query.filter(Test.category == category, Test.check_del != "deleted").all()
            
            if len(all_tests) > 5:
                random.shuffle(all_tests)
                list_tests.append([category, all_tests[0:5]])
            else:
                if len(all_tests) > 0:
                    list_tests.append([category, all_tests])

        else:
            if len (last_passed) > 0:
                last_tests = []

                for id in last_passed:
                    # isdigit - перевіряє, що у рядку є цифра/число
                    if id.isdigit():
                        ready_id = int(id.split("/")[0])
                        test = Test.query.get(ready_id)
                        last_tests.append(test)
                if len(last_tests) > 0 and last_tests[0] != "":
                    list_tests.append([category, last_tests])


    ready_list = list_tests if len(list_tests) <= 4 else list_tests[0:4]

    


    return flask.render_template(
        "home_auth.html", 
        home_auth = True,
        count_tests = current_user.user_profile.count_tests,
        user = user,
        ready_list = ready_list,
        search_test = True,
        nothing = True if len(ready_list) <= 0 else False
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
            if password_form == confirm_password:
                if len(password_form) <= 20 and len(password_form) >= 8: 
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
                    message = "Дотримуйтесь вірної довжини паролю"
            else:
                flask.session.clear()
                password_shake = "Password is not eqal each other"
                message = "Введені паролі не співпадають"
        elif check_form == "clear_form":
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
        random_num = random.randint(1, 5),
        home_page = True
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
                    flask.session["code"] = ''
                    flask.session["email_sent"] = False
                    return flask.redirect("/")
                
    if not flask_login.current_user.is_authenticated or "new_email" in flask.session:
        return flask.render_template(
            template_name_or_list = "verify_code.html", 
            code = 34, 
            code1 = flask.session["code"], 
            verify_code_page = True,
            home_page = True
        ) 
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
            random_num = random.randint(1, 5),
            home_page = True
        )
    else:
        return flask.redirect("/")

def render_google_login():
    # Find out what URL to hit for Google login
    google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Use library to construct the request for Google login and provide
    # scopes that let you retrieve user's profile from Google
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri = flask.url_for("login.render_google_callback", _external=True),
        scope=["openid", "email", "profile"],
    )
    print("login func end")
    return flask.redirect(request_uri)

def render_google_callback():
    print("callback func start")
    # Get authorization code Google sent back to you
    code = flask.request.args.get("code")
    # Find out what URL to hit to get tokens that allow you to ask for
    # things on behalf of a user
    google_provider_cfg = requests.get(GOOGLE_DISCOVERY_URL).json()
    token_endpoint = google_provider_cfg["token_endpoint"]

    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    # Prepare and send a request to get tokens! Yay tokens!
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=flask.request.url,
        redirect_url=flask.request.base_url,
        code=code
    )

    print(token_url, "\nheaders=", headers, "data=", body)

    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    # Parse the tokens!
    client.parse_request_body_response(json.dumps(token_response.json()))

    # Now that you have tokens (yay) let's find and hit the URL
    # from Google that gives you the user's profile information,
    # including their Google profile image and email
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    # You want to make sure their email is verified.
    # The user authenticated with Google, authorized your
    # app, and now you've verified their email through Google!
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return "User email not available or not verified by Google.", 400

    flask.session["username"] = users_name
    flask.session["user_email"] = users_email
    flask.session["google_id"] = unique_id

    # Send user back to homepage
    return flask.redirect("/registration/complete_finish_signup")

def render_finish_google_signup():
    message = ""
    user = User.query.filter_by(email = flask.session.get("user_email")).first()
    if user:
        return flask.redirect("/login")
    password_shake = ""
    if flask.request.method == "POST":
        mentor_form = bool(flask.request.form["mentor"])

        password_form = flask.request.form["password"]
        confirm_password = flask.request.form["confirm-password"]
        username = flask.request.form["username"]
        if password_form == confirm_password:
            if len(password_form) >= 8 and len(password_form) <= 20:
                avatar = f"default_avatar{random.randint(1,5)}.svg"
                user = User(
                    username=username,
                    email=flask.session.get("user_email"),
                    name_avatar = avatar,
                    google_id=flask.session.get("google_id"),
                    password = password_form,
                    is_mentor = mentor_form
                )
                profile = DataUser()
                user.user_profile = profile

                

                DATABASE.session.add(user)
                DATABASE.session.commit()

                #створює папку із тим шляхом що указали
                path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask.session["user_email"])))
                if not os.path.exists(path):
                    os.mkdir(path)

                    default_avatar_path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", avatar))

                    destination_path = os.path.join(path, avatar)

                    shutil.copyfile(default_avatar_path, destination_path)

                flask_login.login_user(user)
                flask.session["email_sent"] = False
                    
                return flask.redirect("/home_auth")
            else:
                password_shake = "Passwords are not eual"
                message = "Дотримуйтесь вірної довжини паролю"
        else:
            password_shake = "Passwords are not eual"
            message = "Введені паролі не співпадають"
        
    return flask.render_template(
        template_name_or_list = "finish_google_signup.html", 
        password_shake = password_shake,
        username = flask.session.get("username"),
        random_num = random.randint(1, 5),
        message = message,
        registration_page = True
    )