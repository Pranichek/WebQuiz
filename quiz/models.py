import flask_login
from Project.db import DATABASE

class Test(flask_login.UserMixin, DATABASE.Model):
    id = DATABASE.Column(DATABASE.Integer, primary_key = True)

    # amount_question = DATABASE.Column(DATABASE.Integer, nullable = False)
    title_test = DATABASE.Column(DATABASE.String(20), nullable = False)
    questions = DATABASE.Column(DATABASE.String, nullable = False)
    answers = DATABASE.Column(DATABASE.String, nullable = False)
    

    