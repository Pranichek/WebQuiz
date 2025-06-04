import flask_socketio
from .settings import project

# Створюємо екземпляр класу SocketIO, який пов'язаний із нашим проєктом
socket = flask_socketio.SocketIO(app = project)

