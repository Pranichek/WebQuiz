from .db import DATABASE

student_classes = DATABASE.Table('student_classes',
    DATABASE.Column('student_id', DATABASE.Integer, DATABASE.ForeignKey('user.id')),
    DATABASE.Column('class_id', DATABASE.Integer, DATABASE.ForeignKey('class_mentor.id'))
)