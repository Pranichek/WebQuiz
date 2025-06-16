from home.models import User

def ksdkfjnv(id_user) -> int:
    """
    Returns the number of pets for a given user ID.
    :param id_user: The ID of the user.
    :return: The number of pets owned by the user.
    """
    
    user : User = User.query.get(id_user)
    if user.user_profile.pet_id != "":
        return int(user.user_profile)
    else:
        return None
