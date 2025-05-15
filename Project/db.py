import flask_migrate, flask_sqlalchemy, sqlalchemy
import os
from .settings import project

project.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"

DATABASE = flask_sqlalchemy.SQLAlchemy(app = project)

MIGRATE = flask_migrate.Migrate(
    app = project, 
    db = DATABASE,
    directory = os.path.abspath(os.path.join(__file__, "..", "migrations"))
)