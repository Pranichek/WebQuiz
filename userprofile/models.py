from Project.db import DATABASE

class DataUser(DATABASE.Model):
    __tablename__ = 'profile'
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)
    # кількість проїдених тестів
    count_tests = DATABASE.Column(DATABASE.Integer, default = 0, nullable = False)
    # кількість переможних місць
    winners_counts = DATABASE.Column(DATABASE.Integer, default = 0, nullable = False)
    # айді останніх пройденів тестів
    last_passed = DATABASE.Column(DATABASE.String, default = '')

    user = DATABASE.relationship("User", back_populates="user_profile")
    user_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey('user.id'), unique=True)


    # айді



# class UserAvatar(DATABASE.Model):
#     id = DATABASE.Column(DATABASE.Integer, primary_key = True)

#     owner_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey("user.id"))
#     name_avatar = DATABASE.Column(DATABASE.String, default = "default_avatar.png")
#     # user_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey("user.id"))
#     image_size = DATABASE.Column(DATABASE.Integer, default = 1)