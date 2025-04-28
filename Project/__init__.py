from .urls import *
from .loadenv import execute
from .settings import project
from .db import *

from home.models import *

project.register_blueprint(blueprint = home.home_app)
project.register_blueprint(blueprint = home.registration)
project.register_blueprint(blueprint = home.login)