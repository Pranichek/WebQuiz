import flask, flask_login
from Project.login_check import login_decorate
from .models import Classes

@login_decorate
def render_mentor_class():
    class_code = flask.request.args.get('class_key')
    check_class = Classes.query.filter_by(code= class_code).first()

    if not check_class or check_class.mentor_id != flask_login.current_user.id:
        return flask.redirect("/")

    return flask.render_template(
        "mentor_class.html",
    )