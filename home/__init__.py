from .apps import home_app, registration, login
from .views import render_home, render_registration, render_login, render_home_auth, render_code, clear_code
from .send_email import send_code, generate_code
from .select_tests import render_select_tests, render_catalog_tests