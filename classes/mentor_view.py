import flask, flask_login
from Project.login_check import login_decorate
from .models import Classes, TextTask
from Project.db import DATABASE
from datetime import datetime, timedelta
from Project.settings import project
from flask import request, jsonify

@project.route('/create_task', methods=['POST']) 
@flask_login.login_required
def create_task():
    try:
        data = request.json
        
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        class_code = data.get('class_key')
        check_class = Classes.query.filter_by(code=class_code).first()
        
        if not check_class:
            return jsonify({"success": False, "error": "Class not found"}), 404
        
        if check_class.mentor_id != flask_login.current_user.id:
            return jsonify({"success": False, "error": "Access denied"}), 403

        title_task = data.get("title")
        description_task = data.get("description")

        try:
            weeks = int(data.get("weeks") or 0)
            days = int(data.get("days") or 0)
            hours = int(data.get("hours") or 0)
            minutes = int(data.get("minutes") or 0)
        except ValueError:
            weeks, days, hours, minutes = 0, 0, 0, 0

        if weeks == 0 and days == 0 and hours == 0 and minutes == 0:
            final_deadline = None
        else:
            final_deadline = datetime.now() + timedelta(weeks=weeks, days=days, hours=hours, minutes=minutes)

        new_task = TextTask(
            topic_task=title_task,        
            description_task=description_task, 
            deadline=final_deadline,  
            parent_class=check_class     
        )

        DATABASE.session.add(new_task)
        DATABASE.session.commit()
        
        return jsonify({"success": True})

    except Exception as e:
        DATABASE.session.rollback()
        print(f"Помилка сервера: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

def format_deadline(deadline):
    if not deadline:
        return "Без строку"
    
    now = datetime.now()
    if deadline < now:
        return "Термін вийшов"
    
    diff = deadline - now
    seconds = diff.total_seconds()
    days = diff.days

    if seconds < 60:
        return "менше хвилини"
    elif seconds < 3600:
        return f"через {int(seconds // 60)} хв."
    elif days < 1:
        return f"через {int(seconds // 3600)} год."
    elif days < 30:
        return f"через {days} дн."
    else:
        return f"до {deadline.strftime('%d.%m.%Y')}"

@login_decorate
def render_mentor_class():
    class_code = flask.request.args.get('class_key')
    check_class = Classes.query.filter_by(code=class_code).first()

    if not check_class or check_class.mentor_id != flask_login.current_user.id:
        return flask.redirect("/")
    
    now = datetime.now()
    
    active_tasks = []
    expired_tasks = []
    for task in check_class.text_tasks:
        if task.deadline and task.deadline < now:
            expired_tasks.append(task)
        else:
            active_tasks.append(task)
    
    active_tasks.sort(key=lambda x: x.deadline if x.deadline else datetime.max)
    expired_tasks.sort(key=lambda x: x.deadline, reverse=True)

    return flask.render_template(
        "mentor_class.html",
        active_tasks=active_tasks,   
        expired_tasks=expired_tasks,
        mentor_class=check_class,        
        time_formatter=format_deadline 
    )