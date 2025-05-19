import flask_login, sqlalchemy
from Project.db import DATABASE


class User(DATABASE.Model, flask_login.UserMixin):
    __tablename__ = "user"
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)

    username = DATABASE.Column(DATABASE.String(150), nullable = False)
    phone_number =  DATABASE.Column(DATABASE.Integer, nullable = False, default = "Не під'єднан")
    nickname = DATABASE.Column(DATABASE.String(150))
    password = DATABASE.Column(DATABASE.String(150), nullable = False)
    email = DATABASE.Column(DATABASE.String(150), nullable = False)
    is_mentor = DATABASE.Column(DATABASE.Boolean, default = False)
    
    name_avatar = DATABASE.Column(DATABASE.String, default = "default_avatar.png")
    size_avatar = DATABASE.Column(DATABASE.Integer, default = 100)

    # Зв'язок з таблицею Test
    tests = DATABASE.relationship("Test", backref = "quiz")


