from flask_socketio import join_room, emit, leave_room
from Project.socket_config import socket


# @socket.on("join_room")
# def handle_join(data):
#     username = data["username"]
#     room = data["room"]

#     join_room(room)

#     emit("user_joined", {"username": username}, room=room)

# @socket.on('disconnect')
# def on_leave(data):
#     username = data['username']
#     room = data['room']
#     print(f"{username} is leaving the room {room}")
#     leave_room(room)
#     emit('user_leave', {"username": username}, room = room)


from flask import request

connected_users = {}

@socket.on("join_room")
def handle_join(data):
    username = data["username"]
    room = data["room"]
    join_room(room)

    connected_users[request.sid] = {
        "username": username,
        "room": room
    }

    emit("user_joined", {"username": username}, room=room)

@socket.on("disconnect")
def handle_disconnect():
    user = connected_users.pop(request.sid, None)
    if user:
        username = user["username"]
        room = user["room"]
        print(f"{username} disconnected from room {room}")
        leave_room(room)
        emit("user_leave", {"username": username}, room=room)
        
@socket.on("send_message")
def handle_send_message(data):
    room = data["room"]
    sender = data["sender"]
    message = data["message"]

    emit("receive_message", {"sender": sender, "message": message}, room=room)