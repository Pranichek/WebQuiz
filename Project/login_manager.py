import flask_login, os, json, dotenv
from home.models import User
from .settings import project
from flask_mail import Mail
from oauthlib.oauth2 import WebApplicationClient

dotenv.load_dotenv(dotenv_path = os.path.abspath(os.path.join(__file__ , "..", "..", ".env")))

with open(os.path.abspath(os.path.join(__file__, "..", "client_secret.json")), "r", encoding="utf-8") as f:
    client_secrets = json.load(f)

GOOGLE_CLIENT_ID = "817699824207-qqtuqu8n8tamm610lnn6rqusu5qi2qe4.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = client_secrets["installed"]["client_secret"]
GOOGLE_DISCOVERY_URL = ("https://accounts.google.com/.well-known/openid-configuration")


login_manager = flask_login.LoginManager(
    app = project
)
client = WebApplicationClient(GOOGLE_CLIENT_ID)
project.secret_key = os.getenv("SECRET_KEY")

@login_manager.user_loader
def load_user(id):
    return User.query.get(id)


project.config['MAIL_SERVER'] = 'smtp.gmail.com'
project.config['MAIL_PORT'] = 587
project.config['MAIL_USERNAME'] = os.getenv("EMAIL_USERNAME")
project.config['MAIL_PASSWORD'] = os.getenv("EMAIL_PASSWORD")
project.config['MAIL_DEFAULT_SENDER'] = os.getenv("EMAIL_USERNAME")
project.config['MAIL_USE_SSL'] = False
project.config['MAIL_USE_TLS'] = True
project.secret_key = os.getenv("SECRET_KEY")

mail = Mail(app = project)

