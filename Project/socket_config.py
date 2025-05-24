import flask_login, flask_socketio
from .settings import project

# Створюємо екземпляр класу SocketIO, який пов'язаний із нашим проєктом
socket = flask_socketio.SocketIO(app= project)

# Створюємо обробник події "message"
@socket.on("message")
def hendler_message(message):
    # Отримуємо текст з надісланого повідомлення
    message_text = message["text"]

    # Формуємо новий словник, де буде зберігатися повідомлення та ім'я корисутвача
    new_message = {
        'username': flask_login.current_user.username,
        'text': message_text
    }

    # Відправляємо усім підключегим клієнтам повідомлення через socketio
    flask_socketio.emit('message', new_message)
    