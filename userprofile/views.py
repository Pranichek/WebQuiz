import flask, os, flask_login, random
import PIL.Image
from home.models import User
from Project.db import DATABASE
from .render_data import create_email, render_phone_number
from home.send_email import send_code, generate_code 

def render_profile():
    user = flask_login.current_user
    if flask.request.method == "POST":
        check_form = flask.request.form.get("form_name")

        if check_form == "change_name":
            user.username = flask.request.form["new_name"]
            DATABASE.session.commit()

        elif check_form == "change_phone":
            print(flask.request.form["phone_number"][1:])
            if User.query.filter_by(phone_number = flask.request.form["phone_number"][1:]).first() is None:
                user.phone_number = flask.request.form["phone_number"]
                DATABASE.session.commit()
            else:
                return "Такий номер телефону вже зареєстрован"
        elif check_form == "password":
            if flask.request.form["old_password"] == user.password:

                user.password = flask.request.form["new_password"]
                DATABASE.session.commit()
            
        elif check_form == "send_code":
            code = generate_code()
            flask.session["code"] = code
            flask.session["email"] = flask.request.form["new_email"]
            send_code(recipient = flask.request.form["new_email"], code = int(flask.session["code"]))
        elif check_form == "email":
            if str(flask.request.form["code_new_email"]) == flask.session["code"]:
                old_name_folder = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(user.email)))
                new_name_folder = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask.session["email"])))
                user.email = flask.session["email"]
                os.rename(old_name_folder, new_name_folder)
                DATABASE.session.commit()
        elif check_form == "logout":
            flask.session.clear()

         
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
    user = flask_login.current_user
    show = ['']
    if flask.request.method == "POST":
        check_form = flask.request.form.get("check_form")
        if check_form == "load_image":
            print("oda")
            if 'file' not in flask.request.files:
                return flask.redirect("/")
            
            file = flask.request.files["file"]
            if not os.path.exists(os.path.abspath(os.path.join(__file__, "..", "static", "images", 'edit_avatar', str(flask_login.current_user.email), "cash"))):
                os.mkdir(path= os.path.abspath(os.path.join(__file__, "..", "static", "images", 'edit_avatar', str(flask_login.current_user.email), "cash")))

            path_to_avatar = os.path.abspath(os.path.join(__file__, "..", "static", "images", 'edit_avatar', str(flask_login.current_user.email), "cash", str(file.filename)))
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
                DATABASE.session.commit()

                img = PIL.Image.open(fp = os.path.abspath(os.path.join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(flask_login.current_user.email), "cash", str(flask.session["cash_image"]))))
                # save a image using extension

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
            DATABASE.session.commit()
        elif check_form == "del_image":
            default_avatars = ["default_avatar.png", "default_picture2.png", "default_picture3.png", "default_picture4.png","default_picture5.png"]
            if str(flask_login.current_user.name_avatar) not in default_avatars:
                flask_login.current_user.name_avatar = str(random.choice(default_avatars))
                DATABASE.session.commit()

            
    if flask_login.current_user.is_authenticated:
        return flask.render_template(
            template_name_or_list = "edit_avatar.html",
            user = user,
            show = show[0],
            cash_image = str(flask.session["cash_image"])
        )
    else:
        return flask.redirect("/")