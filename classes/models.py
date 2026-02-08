from Project.db import DATABASE
from Project.settings_classes_many import student_classes

# 1.Хто виконав завдання
submitted_tasks = DATABASE.Table('submitted_tasks',
    DATABASE.Column('user_id', DATABASE.Integer, DATABASE.ForeignKey('user.id')),
    DATABASE.Column('task_id', DATABASE.Integer, DATABASE.ForeignKey('text_task.id'))
)

class Classes(DATABASE.Model):
    __tablename__ = "class_mentor"
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)
    
    name_class = DATABASE.Column(DATABASE.String)
    form = DATABASE.Column(DATABASE.Integer)
    letter = DATABASE.Column(DATABASE.String(1))
    description = DATABASE.Column(DATABASE.String(255))
    lesson = DATABASE.Column(DATABASE.String(25))
    type = DATABASE.Column(DATABASE.String, default = None)
    code = DATABASE.Column(DATABASE.String(8), unique = True)

    mentor_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey("user.id"), nullable=False)
    mentor = DATABASE.relationship("User", back_populates="classes")

    students = DATABASE.relationship(
        "User",
        secondary= student_classes,
        back_populates= "joined_classes",
        lazy= "select" #чтобы можно было получить учеников в виде списка(каждый раз кога будем пытаться сделать запрос чтобы получить всех людей, то будет происходит отдельынй запрос)
    )

    text_tasks = DATABASE.relationship("TextTask", back_populates="parent_class")


class TextTask(DATABASE.Model):
    __tablename__ = "text_task"
    id = DATABASE.Column(DATABASE.Integer, primary_key=True)

    topic_task = DATABASE.Column(DATABASE.String, default="")
    description_task = DATABASE.Column(DATABASE.String, default="")
    
    deadline = DATABASE.Column(DATABASE.DateTime, nullable=True) 
    
    class_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey("class_mentor.id"), nullable=False)
    parent_class = DATABASE.relationship("Classes", back_populates="text_tasks")

    # список учнів які натиснули "Сдати"
    completed_by = DATABASE.relationship(
        "User", 
        secondary= submitted_tasks, 
        backref= "completed_tasks",
        lazy= "dynamic" # Дозволяє разувати через count()
    )