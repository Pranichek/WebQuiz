import flask_login, sqlalchemy
from Project.db import DATABASE
from Project.settings_many import room_users, check_socket

class Rooms(DATABASE.Model):
    __tablename__ = "room"
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)
    
    room_code = DATABASE.Column(DATABASE.String)
    id_test =  DATABASE.Column(DATABASE.Integer)
    # айді тіпочков которіе находятся в кімнаті (1 2 3)
    # users = DATABASE.Column(DATABASE.String)
    users = DATABASE.relationship(
        "User",
        secondary=room_users,
        back_populates="rooms"
    )


    sockets_users = DATABASE.relationship(
        "User",
        secondary=check_socket, 
        back_populates="room_sockets"
    )

    # найкараще питання за тест
    best_question = DATABASE.Column(DATABASE.Integer)

    # найгірше питання за тест
    worst_question = DATABASE.Column(DATABASE.Integer)

    # Зв'язок one to one із користувачем
    user = DATABASE.relationship("User", back_populates="room")
    user_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey('user.id'), unique=True)