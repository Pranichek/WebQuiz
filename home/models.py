import flask_login, sqlalchemy
from Project.db import DATABASE


class User(DATABASE.Model, flask_login.UserMixin):
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)

    username = DATABASE.Column(DATABASE.String(150), nullable = False)
    phone_number =  DATABASE.Column(DATABASE.Integer, nullable = False, unique = True)
    nickname = DATABASE.Column(DATABASE.String(150), unique = True)
    password = DATABASE.Column(DATABASE.String(150), nullable = False)
    email = DATABASE.Column(DATABASE.String(150), unique = True, nullable = False)
    is_mentor = DATABASE.Column(DATABASE.Boolean, default = False)
    count_tests = DATABASE.Column(DATABASE.Integer, default = 0)
    winning_tests = DATABASE.Column(DATABASE.Integer, default = 0)

    name_avatar = DATABASE.Column(DATABASE.String, default = "default_avatar.png")
