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

        username_form = flask.request.form["username"]
        surname_form = flask.request.form["surname"]

        email_form = flask.request.form["email"]
        phone_number_form = flask.request.form["phone_number"]
        mentor_form = flask.request.form["mentor"]

        password_form = flask.request.form["password"]
        confirm_password = flask.request.form["confirm-password"]

        if password_form == confirm_password:
            if User.query.filter_by(email = email_form).first() is None and User.query.filter_by(phone_number = phone_number_form).first() is None:
                if username_form != '' and surname_form != '':
                    is_mentor = None
                    if mentor_form == 'True':
                        is_mentor = True
                    else:
                        is_mentor = False

                    random_code = random.randint(000000, 999999)
                    flask.session["code"] = random_code
                    flask.session["email"] = email_form
                    flask.session["username"] = username_form
                    flask.session["surname"] = surname_form
                    flask.session["check_mentor"] = is_mentor
                    flask.session["phone_number"] = phone_number_form
                    flask.session["password"] = password_form
                    flask.session["attempts_auth"] = 3

                    msg = Message(
                        subject='Hello from the other side!', 
                        sender='ваша пошта',  
                        recipients=[str(email_form)] 
                    )

                    link = flask.url_for("registration.render_code", _external=True)
                    msg.html = f"""
                        <html>
                            <body>
                                <h1>Привіт, друже!</h1>
                                <p>Твій код підтвердження: {flask.session["code"]}</p>
                                <a href="{link}">Натисни на посилання щоб ввести код!</a>
                            </body>
                        </html>
                        """
                    # msg.body = "<tr><td><a href=\"{}\">{}</a></td></tr>".format(link, "Натисни тут щоб увести код підтвердження")
                    # msg.body = "Привіт, ось твій код підтвердження пошти:{}\n Та ось посилання де ти повинен його ввести <a href={}>Link</a>".format(flask.session["code"], link)
                    mail.send(msg)
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

def render_code():
    if flask.request.method == "POST":
        if flask.request.form["verify_code"] != '':
            if int(flask.session["code"]) == int(flask.request.form["verify_code"]):
                user = User(
                        username = flask.session["username"],
                        password = flask.session["password"],
                        email = flask.session["email"],
                        phone_number = flask.session["phone_number"],
                        surname = flask.session["surname"],
                        is_mentor = flask.session["check_mentor"]
                    )
                
                DATABASE.session.add(user)
                DATABASE.session.commit()
                flask_login.login_user(user)

                return flask.redirect("/")
        elif flask.session["code"] != flask.request.form["verify_code"]:
            flask.session["attempts_auth"] -= 1

    if flask.session["attempts_auth"] == 0:
        flask.session.clear()
        print("che")
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