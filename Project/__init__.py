from .urls import *
from .db import *
from .loadenv import execute
from .socket_config import *
from .settings import project
from .login_manager import *

from home.models import *
from quiz.models import *
from userprofile.models import *

project.register_blueprint(blueprint = home.home_app)
project.register_blueprint(blueprint = home.registration)
project.register_blueprint(blueprint = home.login)
project.register_blueprint(blueprint = userprofile.profile)
project.register_blueprint(blueprint = userprofile.edit_avatar)
project.register_blueprint(blueprint = userprofile.test_result_app)
project.register_blueprint(blueprint = quiz.change_tests)
project.register_blueprint(blueprint = quiz.mentor)
project.register_blueprint(blueprint = quiz.student)
project.register_blueprint(blueprint = quiz.test_pass)
project.register_blueprint(blueprint = pass_quiz.finish_test)
project.register_blueprint(blueprint = searches.search)
project.register_blueprint(blueprint = userprofile.buy_gifts)
project.register_blueprint(blueprint = pass_quiz.passing_mentor)
project.register_blueprint(blueprint = pass_quiz.passing_student)
project.register_blueprint(blueprint = userprofile.user_graphics)