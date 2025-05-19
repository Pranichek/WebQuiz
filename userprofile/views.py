import flask, os, flask_login, random, shutil
from threading import Thread
import PIL.Image
from home.models import User
from Project.db import DATABASE
from .render_data import create_email, render_phone_number
from home.send_email import send_code, generate_code 
from quiz.models import Test

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
        
        elif check_form == "delete":
            user = User.query.get(flask_login.current_user.id)
            #удаляем папку с его медиа файлами
            shutil.rmtree(os.path.abspath(os.path.join(__file__, "..", "static", "images", "edit_avatar", str(user.email))))
            user.email = "Deleted"
            user.phone_number = "Deleted"
            
            flask.session.clear()
            # DATABASE.session.delete(user)
            DATABASE.session.commit()
            return flask.redirect("/")

    if flask_login.current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "profile.html",
            email = create_email(flask_login.current_user.email),
            phone_user = render_phone_number(flask_login.current_user.phone_number),
            user = user
        )
    else:
        return flask.redirect("/")
    
    
def render_edit_avatar():
    try:
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

                    print(check_form)
                    data_range = int(flask.request.form.get("hide-size"))
                    flask_login.current_user.size_avatar = int(100 + (120 * (data_range / 100)))
                    DATABASE.session.commit()

                    img = PIL.Image.open(fp = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "cash", str(flask.session["cash_image"]))))

                    img = img.save(fp = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email) , str(flask.session["cash_image"]))))
                    os.remove(path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "cash", str(flask.session["cash_image"]))))
                    
                except Exception as error:
                    print(error)
            elif check_form == "defaul_avatar":
                number_avatar = flask.request.form.get("data_avatar")

                name_avatar = ''

                if number_avatar == "1":
                    name_avatar = "default_avatar.png"
                elif number_avatar == "2":
                    name_avatar = "default_picture2.png"
                elif number_avatar == "3":
                    name_avatar = "default_picture3.png"
                elif number_avatar == "4":
                    name_avatar = "default_picture4.png"
                elif number_avatar == "5":
                    name_avatar = "default_picture5.png"
            
                default_img = PIL.Image.open(fp = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", name_avatar)))
                # save a image using extension
                if not os.path.exists(path = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email) , name_avatar))):
                    default_img = default_img.save(fp=os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email) , name_avatar)))

                flask_login.current_user.name_avatar = name_avatar
                flask_login.current_user.size_avatar = 100
                DATABASE.session.commit()
            elif check_form == "del_image":
                default_avatars = ["default_avatar.png", "default_picture2.png", "default_picture3.png", "default_picture4.png","default_picture5.png"]
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

                
        if flask_login.current_user.is_authenticated:
            return flask.render_template(
                template_name_or_list = "edit_avatar.html",
                user = user,
                show = show[0],
                cash_image = str(flask.session["cash_image"] if 'cash_image' in flask.session else "Nothing")
            )
        else:
            return flask.redirect("/")
    except Exception as error:
        return flask.redirect("/")
    
def render_user_tests():
    if flask_login.current_user.is_authenticated:
        #отримати айді нашого користувача
        user_id = flask_login.current_user.id
        # отримаємо усі тест, які створив наш користувач
        tests = Test.query.filter_by(creator = user_id).all()

        return flask.render_template(
            template_name_or_list = "user_tests.html",
            tests = tests,
            user = flask_login.current_user
        )
    else:
        return flask.redirect("/")