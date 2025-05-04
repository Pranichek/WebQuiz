import flask_login
from home.models import User
from .settings import project
import secrets, dotenv, os
from flask_mail import Mail

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


dotenv.load_dotenv(dotenv_path = os.path.abspath(os.path.join(__file__ , "..", "..", ".env")))

project.config['MAIL_SERVER'] = 'smtp.gmail.com'
project.config['MAIL_PORT'] = 587
project.config['MAIL_USERNAME'] = os.getenv("EMAIL_USERNAME")
project.config['MAIL_PASSWORD'] = os.getenv("EMAIL_PASSWORD")
project.config['MAIL_DEFAULT_SENDER'] = os.getenv("EMAIL_USERNAME")
project.config['MAIL_USE_SSL'] = False
project.config['MAIL_USE_TLS'] = True

mail = Mail(app = project)