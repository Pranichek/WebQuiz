from Project.db import DATABASE

class Classes(DATABASE.Model):
    __tablename__ = "class_mentor"
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)
    
    name_class = DATABASE.Column(DATABASE.String)
    form = DATABASE.Column(DATABASE.Integer)
    letter = DATABASE.Column(DATABASE.String(1))
    description = DATABASE.Column(DATABASE.String(255))
    lesson = DATABASE.Column(DATABASE.String(25))
    type = DATABASE.Column(DATABASE.Boolean, default = None)
    code = DATABASE.Column(DATABASE.String(8))

    # користувачі, що знаходяться у класі
    students = DATABASE.Column(DATABASE.String, default = '')

    # збереження інформації текстового оголошення
    theme_task = DATABASE.Column(DATABASE.String, default = "")
    information_task = DATABASE.Column(DATABASE.String, default = "")

    # Зв'язок one to one із користувачем
    user_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey("user.id"), nullable=False)
    user = DATABASE.relationship("User", back_populates="mentor_class")
    