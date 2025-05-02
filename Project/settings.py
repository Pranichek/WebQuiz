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
project.config['MAIL_USERNAME'] = 'vovagrinchenko19@gmail.com'
project.config['MAIL_PASSWORD'] = 'zvhp owax qsvh ubry' 
project.config['MAIL_DEFAULT_SENDER'] = 'vovagrinchenko19@gmail.com'
project.config['MAIL_USE_TLS'] = True
project.config['MAIL_USE_SSL'] = False


mail = Mail(app = project)
s = URLSafeTimedSerializer("Thisisasecretkey")

