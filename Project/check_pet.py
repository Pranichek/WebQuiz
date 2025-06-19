from home.models import User

def cheker_for_pets(id_user) -> int:
    user : User = User.query.get(id_user)
    pet_id = user.user_profile.pet_id

    if pet_id and pet_id.strip() != "":
        return int(pet_id)
    else:
        return None