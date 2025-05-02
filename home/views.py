import flask
from .models import User
from Project.db import DATABASE
from Project.settings import s, mail
from itsdangerous import SignatureExpired
from flask_mail import Message
from validate_email import validate_email
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
        return flask.render_template("home_auth.html")
    else:
        return flask.redirect("/")
    

def render_registration():
    message = ''
    if flask.request.method == "POST":
        email_form = flask.request.form["email"]
        number_form = flask.request.form["phone_number"]
        name_form = flask.request.form["name"]
        surname_form = flask.request.form["surname"]
        mentor_form = flask.request.form["mentor"]
        if User.query.filter_by(phone_number = number_form).first() is None:
            if name_form != '' and surname_form != '':
                is_mentor = None
                if mentor_form == 'True':
                    is_mentor = True
                else:
                    is_mentor = False
                random_code = random.randint(000000, 999999)
                flask.session["code"] = random_code
                flask.session["email"] = email_form
                flask.session["name"] = name_form
                flask.session["surname"] = surname_form
                flask.session["check_mentor"] = is_mentor
                flask.session["phone_number"] = number_form
                flask.session["password"] = flask.request.form["password"]
                flask.session["attempts_auth"] = 3

                # token = s.dumps(email_form, salt = "email-confirm")

                email = flask.request.form["email"]

                msg = Message(
                    subject='Hello from the other side!', 
                    sender='vovagrinchenko19@gmail.com',  
                    recipients=[str(email)]  # Replace with actual recipient's email
                )
                msg.body = "Привіт, ось твій код підтвердження пошти:{}".format(flask.session["code"])
                # msg.body = "Привіт, ось твій код підтвердження пошти:{}".format(token)
                mail.send(msg)

                return flask.redirect("/verify_code")
            else:
                message = "Please fill in all the fields"
        else:
            message = "User already exists"
        
    return flask.render_template(
        template_name_or_list = "registration.html", 
        message = message, 
        registration_page = True
    )

def render_code():
    if flask.request.method == "POST":
        if int(flask.session["code"]) == int(flask.request.form["verify_code"]):
            user = User(
                    name = flask.session["name"],
                    password = flask.session["password"],
                    email = flask.session["email"],
                    phone_number = flask.session["phone_number"],
                    surname = flask.session["surname"],
                    is_mentor = flask.session["check_mentor"]
                )
            
            DATABASE.session.add(user)
            DATABASE.session.commit()
            flask_login.login_user(user)

            flask.session.clear()
            return flask.redirect("/")
        elif flask.session["code"] != flask.request.form["verify_code"]:
            flask.session["attempts_auth"] -= 1

    if flask.session["attempts_auth"] == 0:
        flask.session.clear()
        return flask.redirect("/")
    else:
        return flask.render_template(template_name_or_list = "verify_code.html", session_code = flask.session["code"])    

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