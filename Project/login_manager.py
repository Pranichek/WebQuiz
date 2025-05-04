import flask_login
from home.models import User
from .settings import project
# from cryptography.fernet import Fernet
import secrets

# генерируем ключ
# key = Fernet.generate_key()
key = secrets.token_hex()
#создаем обьект от этого класса 
# f = Fernet(key)
#шифруем нашь ключ, после этого превращается как в токен
project.secret_key = key

login_manager = flask_login.LoginManager(
    app = project
)

@login_manager.user_loader
def load_user(id):
    return User.query.get(id)