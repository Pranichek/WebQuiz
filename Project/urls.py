import home

home.home_app.add_url_rule(
    rule = "/",
    view_func = home.render_home,
    methods = ["GET", "POST"]
)

home.registration.add_url_rule(
    rule = "/authorization",
    view_func = home.render_registration,
    methods = ["GET", "POST"]
)

home.login.add_url_rule(
    rule = "/login",
    view_func = home.render_login,
    methods = ["GET", "POST"]
)