import flask_socketio
from .settings import project

# Створюємо екземпляр класу SocketIO, який пов'язаний із нашим проєктом
# async_mode="eventlet" - топовая штука которая по сути делает запросы сокета асинхронными, то есть намного быстрее
socket = flask_socketio.SocketIO(app = project, async_mode="eventlet")


