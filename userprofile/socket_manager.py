from flask_socketio import join_room, emit, leave_room, disconnect
from Project.socket_config import socket

from flask import request



connected_users = {}
username_to_sid = {} 

@socket.on("join_room")
def handle_join(data):
    username = data["username"]
    room = data["room"]

    join_room(room)

    connected_users[request.sid] = {
        "username": username,
        "room": room
    }
    username_to_sid[username] = request.sid

    print(f"{username} joined {room}")
    emit("user_joined", {"username": username}, room=room)


@socket.on("kick_user")
def handle_kick(data):
    target_username = data["target_username"]
    room = data["room"]

    target_sid = username_to_sid.get(target_username)

    if target_sid:
        print(f"Kicking user {target_username} (sid {target_sid}) from room {room}")
        emit("kicked", {"reason": "You were kicked by the room creator"}, to=target_sid)
        disconnect(sid=target_sid)

@socket.on("disconnect")
def handle_disconnect():
    user = connected_users.pop(request.sid, None)
    if user:
        username = user["username"]
        room = user["room"]
        username_to_sid.pop(username, None)

        print(f"{username} disconnected from room {room}")
        leave_room(room)
        emit("user_leave", {"username": username}, room=room)

        
@socket.on("send_message")
def handle_send_message(data):
    room = data["room"]
    sender = data["sender"]
    message = data["message"]

    emit("receive_message", {"sender": sender, "message": message}, room=room)