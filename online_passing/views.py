import flask, flask_login, qrcode, os
from Project.login_check import login_decorate
from os.path import exists, abspath, join
from Project.socket_config import socket
from flask_login import current_user
from .del_files import delete_files_in_folder
from Project.db import DATABASE
from quiz.models import Test

@login_decorate
def render_mentor():
    id_test = flask.request.args.get("id_test")
    # отримуємо код кімнати з параметрів запиту
    code = flask.request.args.get("room_code")
    test : Test = Test.query.get(id_test)

    
    # зберігаємо об'єкт користувача в змінну
    user = flask_login.current_user

    # qrcode - 
    # Створюємо QR-код(об'єкт) з посиланням на кімнату
    qr = qrcode.QRCode(
        # корекцыя помилок - висока
        error_correction = qrcode.constants.ERROR_CORRECT_H, 
        # розмір qrcode
        box_size = 15,
        # розмір рамки навколо qrcode
        border = 2
    )
    # задаємо посилання на яке буде вести QR-код
    qr.add_data(f"http://127.0.0.1:5000/student?room_code={code}")
    # створюємо QR-код, але у вигляді закодовоного коду
    qr.make(fit = True)

    # створюємо зображення QR-коду
    image = qr.make_image(
        # кольори QR-коду
        fill_color = '#000000',
        # колір фону QR-коду
        back_color = "#ffffff",
    )

    # зберігаємо зображення QR-коду в папку користувача
    if not exists(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "qrcodes"))):
        os.makedirs(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email), "qrcodes")))
    if not os.path.exists(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "qrcodes", f"{code}.png"))):
        delete_files_in_folder(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "qrcodes")))
        with open((abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "qrcodes", "chat.json"))), "w") as f:
            f.write("")

    image.save(abspath(join(__file__, "..", "..", "userprofile", "static", "images", "edit_avatar", str(current_user.email),  "qrcodes", f"{code}.png")))
    
    

    if flask.request.method == "POST":
        socket.emit()

    return flask.render_template(
        "mentor.html",
        mentor = True,
        code = code,
        user = user,
        title_test = test.title_test
    )


# @login_decorate
def render_student():
    if flask_login.current_user.is_authenticated:
        current_user.user_profile.count_points = 0
        DATABASE.session.commit()

    return flask.render_template(
        "student.html",
        user = flask_login.current_user if flask_login.current_user.is_authenticated else None
    )