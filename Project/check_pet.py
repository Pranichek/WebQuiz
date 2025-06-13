from home.models import User

def cheker_for_pets(id_user) -> int:
    user : User = User.query.get(id_user)
    if user.user_profile.pet_id != " ":
        return int(user.user_profile)
    else:
        return None