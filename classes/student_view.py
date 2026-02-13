import flask, flask_login
from .models import Classes, TextTask
from .mentor_view import format_deadline
from datetime import datetime
from Project.settings import project
from Project.db import DATABASE
from flask import request, jsonify
from flask_socketio import join_room, emit


@project.route('/toggle_task_status', methods=['POST'])
def toggle_task_status():
    try:
        data = flask.request.get_json()
        task_id = data.get('task_id')
        
        if not task_id:
            return jsonify({"success": False, "error": "No ID"}), 400

        task = TextTask.query.get(task_id)
        if not task:
            return jsonify({"success": False, "error": "Task not found"}), 404

        user = flask_login.current_user

        if user in task.completed_by:
            task.completed_by.remove(user) 
        else:
            task.completed_by.append(user) 

        DATABASE.session.commit()
        
        return jsonify({"success": True})

    except Exception as e:
        DATABASE.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
    
    
def render_student_class():
    class_code = flask.request.args.get('class_key')
    check_class = Classes.query.filter_by(code=class_code).first()

    if not check_class:
        return flask.redirect("/")
    
    join_room(str(check_class.code))
    
    now = datetime.now()
    current_user = flask_login.current_user
    
    active_tasks = []     
    expired_tasks = []    
    completed_tasks = []  

    for task in check_class.text_tasks:
        if current_user in task.completed_by:
            completed_tasks.append(task)
        elif task.deadline and task.deadline < now:
            expired_tasks.append(task)
        else:
            active_tasks.append(task)
    
    active_tasks.sort(key=lambda x: x.deadline if x.deadline else datetime.max)
    expired_tasks.sort(key=lambda x: x.deadline, reverse=True)


    
    return flask.render_template(
        template_name_or_list="student_class.html",
        student_class=check_class,
        active_tasks=active_tasks,
        expired_tasks=expired_tasks,
        completed_tasks=completed_tasks,
        time_formatter=format_deadline 
    )