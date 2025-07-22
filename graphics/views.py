import flask
from flask_login import current_user
from Project.socket_config import socket

#Просто головна сторінка
def render_graphic():
    return flask.render_template(
        template_name_or_list = "choose_graphics.html", 
    )
    
    