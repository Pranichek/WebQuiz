import flask_login
from Project.db import DATABASE

class Test(DATABASE.Model):
    # задаємо назву моделі тесту
    __tablename__ = "test"
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)

    # amount_question = DATABASE.Column(DATABASE.Integer, nullable = False)
    title_test = DATABASE.Column(DATABASE.String(20), nullable = False)
    questions = DATABASE.Column(DATABASE.String, nullable = False)
    answers = DATABASE.Column(DATABASE.Text, nullable = False)
    question_time = DATABASE.Column(DATABASE.String, nullable = False)
    image = DATABASE.Column(DATABASE.String)
    category = DATABASE.Column(DATABASE.String, nullable = False)

    # Зв'язок з таблицею User
    user_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey("user.id"), nullable=False)
    user = DATABASE.relationship("User", back_populates="tests")

    # Зв'язок із таблицею даних про тест(one to one)
    test_profile = DATABASE.relationship("TestData", back_populates="test", uselist=False)
    

    
class TestData(DATABASE.Model):
    __tablename__ = "test_data"

    id = DATABASE.Column(DATABASE.Integer, primary_key = True)

    # кол-во прохождения этого теста
    amount_passes = DATABASE.Column(DATABASE.Integer, default = 0)

    # Зв'язок із тестом(one to one)
    test = DATABASE.relationship("Test", back_populates="test_profile")
    test_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey('test.id'), unique=True)