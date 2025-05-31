from Project.db import DATABASE

class DataUser(DATABASE.Model):
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)
    # кількість проїдених тестів
    count_tests = DATABASE.Column(DATABASE.Integer, default = 0, nullable = False)

    # айді



# class UserAvatar(DATABASE.Model):
#     id = DATABASE.Column(DATABASE.Integer, primary_key = True)

#     owner_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey("user.id"))
#     name_avatar = DATABASE.Column(DATABASE.String, default = "default_avatar.png")
#     # user_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey("user.id"))
#     image_size = DATABASE.Column(DATABASE.Integer, default = 1)