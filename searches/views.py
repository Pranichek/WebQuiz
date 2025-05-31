import flask
from quiz.models import Test

def render_data_filter():
    input_data = flask.request.cookies.get("filter_data")

    if input_data is not None:
        tests = Test.query.all()

        searching_test = []
        if len(tests) > 0:
            for test in tests:
            
                begin = test.title_test[0]
                
                if  input_data.startswith(begin):
                    searching_test.append(test)
        print(searching_test)

    return flask.render_template(
        template_name_or_list = "search.html",
        searching_test = searching_test
    )
