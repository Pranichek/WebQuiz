import flask_login, sqlalchemy
from Project.db import DATABASE

class Rooms(DATABASE.Model):
    __tablename__ = "room"
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)
    
    room_code = DATABASE.Column(DATABASE.String)
    id_test =  DATABASE.Column(DATABASE.Integer)
    # айді тіпочков которіе находятся в кімнаті (1 2 3)
    users = DATABASE.Column(DATABASE.String)

    check_socket = DATABASE.Column(DATABASE.String, default="")

    # найкараще питання за тест
    best_question = DATABASE.Column(DATABASE.Integer)

    # Зв'язок one to one із користувачем
    user = DATABASE.relationship("User", back_populates="room")
    user_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey('user.id'), unique=True)