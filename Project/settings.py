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
project.config['MAIL_PORT'] = 465
project.config['MAIL_USERNAME'] = ''
project.config['MAIL_PASSWORD'] = '' 
project.config['MAIL_USE_SSL'] = True
project.config['MAIL_USE_TLS'] = False
project.config['MAIL_DEFAULT_SENDER'] = ''

mail = Mail(app = project)
s = URLSafeTimedSerializer("Thisisasecretkey")

