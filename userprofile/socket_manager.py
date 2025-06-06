from flask_socketio import join_room, emit
from Project.socket_config import socket

@socket.on("join_room")
def handle_join(data):
    username = data["username"]
    room = data["room"]

    join_room(room)

    emit("user_joined", {"username": username}, room=room)

@socket.on("send_message")
def handle_send_message(data):
    room = data["room"]
    sender = data["sender"]
    message = data["message"]

    emit("receive_message", {"sender": sender, "message": message}, room=room)
