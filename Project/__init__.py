from .urls import *
from .db import *
from .loadenv import execute
from .authenticated_check import config_page
from .settings import project
from .login_manager import *

from home.models import *
from quiz.models import *
# from userprofile.models import *

project.register_blueprint(blueprint = home.home_app)
project.register_blueprint(blueprint = home.registration)
project.register_blueprint(blueprint = home.login)
project.register_blueprint(blueprint = userprofile.profile)
project.register_blueprint(blueprint = userprofile.edit_avatar)
project.register_blueprint(blueprint = quiz.test_pass)