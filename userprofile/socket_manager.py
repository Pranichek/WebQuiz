from flask_socketio import join_room, emit
from Project.socket_config import socket
from flask_login import current_user
import pyperclip

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

@socket.on("start_passing")
def handle_start_test(data):
    room = data["room"]

    emit("start_passing", {"sender": str(current_user.username)}, room=room)

@socket.on("copy_code")
def handle_copy_code(data):
    pyperclip.copy(data["code_room"])

@socket.on("copy_link")
def handle_copy_link(data):
    pyperclip.copy(data["link_room"])