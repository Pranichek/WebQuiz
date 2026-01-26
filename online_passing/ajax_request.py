from Project.settings import project
from flask import request, jsonify
from home.models import User
import flask

@project.route('/get_user_detail_stats', methods=['POST'])
def get_user_detail_stats():
    data = request.json
    user_id = data.get('user_id')
    room_code = data.get('room')
    
    # Знаходимо користувача та його результати
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404


    
    # Приклад даних, які повертаємо:
    response_data = {
        "username": user.username,
        "avatar": flask.url_for('profile.static', filename=f'images/edit_avatar/{user.name_avatar}'),
        "points": user.user_profile.count_points,
        "accuracy": user.user_profile.last_answered.split("𒀱")[1], # Парсинг вашого формату
        "answers_details": [
            # Тут має бути логіка витягування конкретних відповідей
            # {"question": "Питання 1", "user_answer": "А", "correct": True},
            # {"question": "Питання 2", "user_answer": "Б", "correct": False}
        ]
    }

    return jsonify(response_data)