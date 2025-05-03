import flask, os
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer

project = flask.Flask(
    import_name = "Project",
    static_folder = "static",
    static_url_path = "/static",
    template_folder = "templates",
    instance_path = os.path.abspath(os.path.join(__file__, "..", "instance"))
)

project.config['MAIL_SERVER'] = 'smtp.gmail.com'
project.config['MAIL_PORT'] = 587
project.config['MAIL_USERNAME'] = 'ваша пошта'
project.config['MAIL_PASSWORD'] = 'пароль доадтка' 
project.config['MAIL_DEFAULT_SENDER'] = 'ваша пошта'
project.config['MAIL_USE_TLS'] = True
project.config['MAIL_USE_SSL'] = False


mail = Mail(app = project)
s = URLSafeTimedSerializer("Thisisasecretkey")

