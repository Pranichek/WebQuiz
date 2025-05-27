# from Project.db import DATABASE

# class UserAvatar(DATABASE.Model):
#     id = DATABASE.Column(DATABASE.Integer, primary_key = True)

#     owner_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey("user.id"))
#     name_avatar = DATABASE.Column(DATABASE.String, default = "default_avatar.png")
#     # user_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey("user.id"))
#     image_size = DATABASE.Column(DATABASE.Integer, default = 1)