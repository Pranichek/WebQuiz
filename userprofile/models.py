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
    # айді тестів, що сподобались користувачу
    favorite_tests = DATABASE.Column(DATABASE.String, default = ' ')

    # кількість грошей
    count_money = DATABASE.Column(DATABASE.Integer, default = 300)

    # кількість процентів, щоб забарти боунс за проходження тесту
    percent_bonus = DATABASE.Column(DATABASE.Integer, default = 0)

    pet_id = DATABASE.Column(DATABASE.String, default = '1')

    # зв'язок із моделлю користувача one-to-one
    user = DATABASE.relationship("User", back_populates="user_profile")
    user_id = DATABASE.Column(DATABASE.Integer, DATABASE.ForeignKey('user.id'), unique=True)

    # для проходження онлайн тесту
    is_passing = DATABASE.Column(DATABASE.String)






