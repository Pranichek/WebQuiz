import flask
from quiz.models import Test
from Project.login_check import login_decorate

@login_decorate
def render_data_filter():
    # if flask.request.method == "POST":
    #     input_data = flask.request.form.get("search-data")
    # else:
    #     input_data = None
    input_data = flask.request.args.get("input_data")
    print(input_data, "fd")
    searching_test = []

    if input_data is not None:
        tests = Test.query.filter(Test.check_del != "deleted").all()

        if len(tests) > 0:
            for test in tests:
                # убраем пробелы(еслт есть) и делаем текст нижнем регистре
                title = test.title_test.strip().lower()
                if title.startswith(input_data): 
                    searching_test.append(test)
        print(searching_test)

    return flask.render_template(
        template_name_or_list = "search.html",
        searching_test = searching_test
    )