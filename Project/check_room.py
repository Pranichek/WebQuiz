from flask_login import current_user, logout_user
import functools, flask
from online_passing.models import Rooms
from home.models import User
from .db import DATABASE

def check_room(function: object):
    @functools.wraps(function)
    def handler(*args, **kwargs):
        existing_room : Rooms = Rooms.query.filter_by(user_id=current_user.id).first()

        all_users = existing_room.users.split() if existing_room is not None else []
        for id in all_users:
            user : User = User.query.get(int(id))
            if user:
                if len(user.password) == 1:
                    DATABASE.session.delete(user)
                else:
                    user.user_profile.last_answered = ""
        
        if existing_room:
            DATABASE.session.delete(existing_room)

        DATABASE.session.commit()

        # if str(current_user.password) == "1":
        #     DATABASE.session.delete(current_user)
        #     DATABASE.session.commit()
        #     flask.session.clear()
            

        return function(*args, **kwargs)
        
    return handler
