'''
    ?%? між питаннями 
    ?@? між відповідями на різні питання
    (?%+...+%?) правильна відповідь
    (?%-...-%?) неправильна відповідь

    Запис + та - для відповідей у JavaScript
'''

import flask, os, flask_login
from .models import Test
from Project.db import DATABASE
from home.models import User
from os.path import abspath, join




def render_test():
    list_to_template = []
    new_questions = ""
    new_answers = ""
    try:
        new_questions = flask.request.cookies.get("questions").encode('raw_unicode_escape').decode('utf-8')
        new_answers = flask.request.cookies.get("answers").encode('raw_unicode_escape').decode('utf-8')
    except:
        pass
    
    if flask.request.method == "POST":  
        
        test_title = flask.request.form["test_title"]


        test = Test(
            title_test = test_title,
            questions = new_questions,
            answers = new_answers,
            user_id = flask_login.current_user.id
        )
        
        response = flask.make_response(flask.redirect('/'))
        response.delete_cookie("questions")
        response.delete_cookie("answers")
        DATABASE.session.add(test)
        DATABASE.session.commit()
        try:
            os.mkdir(path = abspath(join(__file__, "..", "static", str(test_title))))
        except:
            pass
        return response

    else:
        if new_questions:
            new_answers_list = new_answers.split("?@?")
            new_questions_list = new_questions.split("?%?")

            number = 0
            for question in new_questions_list:
                item = {}
                item["question"] = question
                answers_list = new_answers_list[number].split("%?)(?%")
                temporary_answers_list = []
                for answer in answers_list:
                    answer = answer.replace("(?%", "")
                    answer = answer.replace("%?)", "")
                    answer = answer[1:-1]
                    temporary_answers_list.append(answer)
                item["answers"] = temporary_answers_list
                list_to_template.append(item)
                print("list_to_template =", list_to_template)
                number += 1
    return flask.render_template(template_name_or_list= "test.html", question_list = list_to_template)

def render_create_question():
    return flask.render_template(template_name_or_list= "create_question.html")