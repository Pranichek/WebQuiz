from .apps import home_app, registration, login
from .views import render_home, render_registration, render_login, render_home_auth, render_code, clear_code, render_google_callback, render_google_login, render_finish_google_signup
from .send_email import send_code, generate_code
from .select_tests import render_select_tests, render_catalog_tests
from .input_username import render_input_username