import flask
from .models import User
from Project.db import DATABASE
from Project.settings import s, mail
from itsdangerous import SignatureExpired
import flask_mail
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
        if User.query.filter_by(email = email_form).first() is None and  User.query.filter_by(phone_number = number_form).first() is None:
            if name_form != '' and surname_form != '':
                is_mentor = None
                if mentor_form == 'True':
                    is_mentor = True
                else:
                    is_mentor = False

                user = User(
                    name = flask.request.form["name"],
                    password = flask.request.form["password"],
                    email = flask.request.form["email"],
                    phone_number = flask.request.form["phone_number"],
                    surname = flask.request.form["surname"],
                    is_mentor = is_mentor
                )
                DATABASE.session.add(user)
                DATABASE.session.commit()
                # email = flask.request.form["email"]
                # token = s.dumps(email, salt = "emmail-confirm")

                # msg = flask_mail.Message(subject = "Confirm Email", recipients = [email])

                # # link = flask.url_for("registration.confirm_email", token = token, _external = True)
                # random_number = random.randint(000000, 999999)
                # msg.body = f"Your code is {random_number}"

                # mail.send(msg)

                return flask.redirect("/")
            else:
                message = "Please fill in all the fields"
        else:
            message = "User already exists"
        
    return flask.render_template(
        template_name_or_list = "registration.html", 
        message = message, 
        registration_page = True
    )


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