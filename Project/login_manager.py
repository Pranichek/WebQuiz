import flask_login
from home.models import User
from .settings import project

project.secret_key = "super secret key"

login_manager = flask_login.LoginManager(
    app = project
)

@login_manager.user_loader
def load_user(id):
    return User.query.get(id)