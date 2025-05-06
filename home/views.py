import flask
from .models import User
from Project.db import DATABASE
from Project.login_manager import mail
from flask_mail import Message
import random
import flask_login

#Просто головна сторінка
def render_home():
    if not flask_login.current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "home.html", 
            home_page = True
        )
    else:
        return flask.redirect("/home_auth")
    
#головна сторінка коли користувач увійшов у акаунт
def render_home_auth():    
    if flask_login.current_user.is_authenticated:
        return flask.render_template(
            "home_auth.html", 
            home_auth = True
            )
    else:
        return flask.redirect("/")
    

def generate_code():
    str_code = ''
    for num in range(6):
        random_num = random.randint(0,9)
        str_code += str(random_num)

    return str_code


def render_registration():
    try:
        message = ''
        if flask.request.method == "POST":
            username_form = flask.request.form["username"]

            email_form = flask.request.form["email"]
            phone_number_form = flask.request.form["phone_number"]
            mentor_form = flask.request.form["mentor"]

            password_form = flask.request.form["password"]
            confirm_password = flask.request.form["confirm-password"]

            if password_form == confirm_password:
                if User.query.filter_by(email = email_form).first() is None and User.query.filter_by(phone_number = phone_number_form).first() is None:
                    if username_form != '':
                        is_mentor = None
                        if mentor_form == 'True':
                            is_mentor = True
                        else:
                            is_mentor = False

                        random_code = generate_code()

                        flask.session["code"] = random_code
                        flask.session["email"] = email_form
                        flask.session["username"] = username_form
                        flask.session["check_mentor"] = is_mentor
                        flask.session["phone_number"] = phone_number_form
                        flask.session["password"] = password_form

                        msg = Message(
                            subject = 'Hello from the other side!', 
                            recipients = [str(email_form)] 
                        )

                        msg.html = f"""
                            <html>
                                <body>
                                    <h1>Привіт, друже!</h1>
                                    <p>Твій код підтвердження: {flask.session["code"]}</p>
                                </body>
                            </html>
                            """
    
                        mail.send(msg)
                        return flask.redirect("/verify_code")
                    else:
                        message = "Please fill in all the fields"
                else:
                    message = "User already exists"
            else:
                message = "Паролі не співпадають"
                
        return flask.render_template(
            template_name_or_list = "registration.html", 
            message = message, 
            registration_page = True
        )
    except Exception as error:
        print(error)
        flask.session.clear()
        return flask.redirect("/")

def render_code():
    try:
        form_code = ''
        if flask.request.method == "POST":
            for num_tag in range(1, 7):
                data = str(flask.request.form[f"verify_code{num_tag}"])
                form_code += data
            if form_code != '':
                if str(flask.session["code"]) == form_code:
                    user = User(
                            username = flask.session["username"],
                            password = flask.session["password"],
                            email = flask.session["email"],
                            phone_number = flask.session["phone_number"],
                            is_mentor = flask.session["check_mentor"]
                        )
                    
                    DATABASE.session.add(user)
                    DATABASE.session.commit()
                    flask_login.login_user(user)
                else:
                    return flask.redirect("/")
                
        if not flask_login.current_user.is_authenticated:
            return flask.render_template(template_name_or_list = "verify_code.html") 
        else:
            return flask.redirect("/")
    except Exception as error:
        print(error)
        flask.session.clear()
        return flask.redirect("/")


def render_login():
    if flask.request.method == "POST":
        email_form = flask.request.form["email"]
        password_form = flask.request.form["password"]

        list_users = User.query.all()

        for user in list_users:
            if user.email == email_form and user.password == password_form:
                flask_login.login_user(user)

    if not flask_login.current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "login.html", 
            login_page = True
            )
    else:
        return flask.redirect("/")