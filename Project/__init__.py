from .urls import *
from .db import *
from .loadenv import execute
from .settings import project
from .login_manager import *

from home.models import *

project.register_blueprint(blueprint = home.home_app)
project.register_blueprint(blueprint = home.registration)
project.register_blueprint(blueprint = home.login)
project.register_blueprint(blueprint = userprofile.profile)
project.register_blueprint(blueprint = userprofile.edit_avatar)