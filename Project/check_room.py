import flask
from flask_login import current_user
import functools
from online_passing.models import Rooms
from .db import DATABASE

def check_room(function: object):
    @functools.wraps(function)
    def handler(*args, **kwargs):
        existing_room = Rooms.query.filter_by(user_id=current_user.id).first()
        if existing_room:
            DATABASE.session.delete(existing_room)
            DATABASE.session.commit()

        return function(*args, **kwargs)
        
    return handler
