from Project.db import DATABASE
from Project.settings_classes_many import student_classes

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

    mentor_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey("user.id"), nullable=False)
    mentor = DATABASE.relationship("User", back_populates="classes")

    students = DATABASE.relationship(
        "User",
        secondary=student_classes,
        back_populates="joined_classes",
        lazy="dynamic"
    )

