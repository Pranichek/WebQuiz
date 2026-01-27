import flask_login, sqlalchemy
from Project.db import DATABASE
from Project.settings_many import room_users, check_socket

class User(DATABASE.Model, flask_login.UserMixin):
    __tablename__ = "user"
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)
    
    username = DATABASE.Column(DATABASE.String(150), nullable = False)
    phone_number =  DATABASE.Column(DATABASE.Integer, nullable = False, default = "Не під'єднан")
    nickname = DATABASE.Column(DATABASE.String(150))
    password = DATABASE.Column(DATABASE.String(150))
    email = DATABASE.Column(DATABASE.String(150), nullable = False, unique = True)
    is_mentor = DATABASE.Column(DATABASE.Boolean, default = False)
    
    name_avatar = DATABASE.Column(DATABASE.String)
    size_avatar = DATABASE.Column(DATABASE.Integer, default = 100)

    # Зв'язок з таблицею Test
    # можно так, но если мы используем back_populates то тогда в таблице Test нужно самому создать поле user
    tests = DATABASE.relationship("Test", back_populates="user", lazy="dynamic", cascade="all, delete-orphan")
    # можна так, и тогда нам не нужно в таблице Test создавать поле user
    # tests = DATABASE.relationship("Test", backref="user", lazy="dynamic")

    # Зв'язок one to one із моделлю інфи користувача
    user_profile = DATABASE.relationship("DataUser", back_populates="user", uselist=False, cascade="all, delete-orphan")

    # Зв'язок one to one із моделлю кімнати
    room = DATABASE.relationship("Rooms", back_populates="user", uselist=False)

    # Зв'язок one to one із моделлю класу
    mentor_class = DATABASE.relationship("Classes", back_populates="user", lazy="dynamic")

    google_id = DATABASE.Column(DATABASE.String(50), nullable = True)

    # когда ты в какой то комнате
    rooms = DATABASE.relationship(
        "Rooms",
        secondary=room_users,
        back_populates="users"
    )

    room_sockets = DATABASE.relationship(
        "Rooms",
        secondary=check_socket, 
        back_populates="sockets_users"
    )







