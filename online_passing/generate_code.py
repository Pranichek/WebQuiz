import random
from .models import Rooms

def generate_code():
    str_code = ''
    while True:
        for num in range(6):
            random_num = random.randint(0,9)
            str_code += str(random_num)

        check_room = Rooms.query.filter_by(room_code = str_code).first()

        if not check_room:
            break

    return str_code

