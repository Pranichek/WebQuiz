import flask_login
from Project.db import DATABASE

class User(DATABASE.Model, flask_login.UserMixin):
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)

    name = DATABASE.Column(DATABASE.String(150), nullable = False)
    surname = DATABASE.Column(DATABASE.String(150), nullable = False)
    username = DATABASE.Column(DATABASE.String(150), unique = True)
    password = DATABASE.Column(DATABASE.String(150), nullable = False)
    email = DATABASE.Column(DATABASE.String(150), unique = False, nullable = False)
    is_mentor = DATABASE.Column(DATABASE.Boolean, default = False)
    phone_number = DATABASE.Column(DATABASE.String(150), unique = True, nullable = False)
