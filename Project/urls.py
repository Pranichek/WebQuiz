import home
import userprofile
import quiz
import pass_quiz
import searches
import online_passing
import classes

home.home_app.add_url_rule(
    rule = "/",
    view_func = home.render_home,
    methods = ["GET", "POST"]
)

home.home_app.add_url_rule(
    rule = "/select_tests",
    view_func = home.render_select_tests,
    methods = ["GET", "POST"]
)

home.home_app.add_url_rule(
    rule = "/catalog_tests",
    view_func = home.render_catalog_tests,
    methods = ["GET", "POST"]
)


home.home_app.add_url_rule(
    rule="/home_auth",
    view_func = home.render_home_auth,
    methods = ["GET", "POST"]
)

home.registration.add_url_rule(
    rule = "/registration",
    view_func = home.render_registration,
    methods = ["GET", "POST"]
)

home.registration.add_url_rule(
    rule = "/verify_code",
    view_func = home.render_code,
    methods = ["GET", "POST"]
)

home.login.add_url_rule(
    rule = "/login",
    view_func = home.render_login,
    methods = ["GET", "POST"]
)

home.registration.add_url_rule(
    rule = "/clear_code",
    view_func = home.clear_code
)

userprofile.profile.add_url_rule(
    rule = "/profile",
    view_func= userprofile.render_profile,
    methods= ["GET", "POST"]
)

userprofile.edit_avatar.add_url_rule(
    rule = "/edit_avatar",
    view_func = userprofile.render_edit_avatar,
    methods= ["GET", "POST", 'FILES']
)

userprofile.profile.add_url_rule(
    rule = "/user_test",
    view_func = userprofile.render_user_tests,
    methods = ["GET","POST"]
)

userprofile.test_result_app.add_url_rule(
    rule = "/test_result",
    view_func = userprofile.render_test_result,
    methods = ["GET","POST"]
)

quiz.change_tests.add_url_rule(
    rule = "/change_tests",
    view_func = quiz.render_change_tests,
    methods = ["GET","POST"]
)

# quiz.mentor.add_url_rule(
#     rule = "/mentor",
#     view_func = quiz.render_mentor,
#     methods = ["GET","POST"]
# )

# quiz.student.add_url_rule(
#     rule = "/student",
#     view_func = quiz.render_student,
#     methods = ["GET","POST"]
# )

userprofile.profile.add_url_rule(
    rule = "/test_preview/<int:pk>",
    view_func = userprofile.render_test_preview,
    methods = ["GET","POST"]
)
userprofile.profile.add_url_rule(
    rule = "/test_preview/<int:pk>/change_question/<int:id>",
    view_func = userprofile.render_change_question_preview,
    methods = ["GET","POST"]
)

quiz.test_pass.add_url_rule(
    rule = "/test",
    view_func= quiz.render_test,
    methods = ["GET", "POST"]
)

quiz.test_pass.add_url_rule(
    rule = "/test/create_question",
    view_func = quiz.render_create_question,
    methods = ["GET", "POST"]
)

quiz.test_pass.add_url_rule(
    rule = "/select_way",
    view_func = quiz.render_select_way
)

quiz.test_pass.add_url_rule(
    rule = "/test_data",
    view_func = quiz.render_data_test,
    methods = ["GET", "POST"]
)

quiz.test_pass.add_url_rule(
    rule = "/import_test",
    view_func = quiz.render_import_test,
    methods = ["GET", "POST"]
)

quiz.test_pass.add_url_rule(
    rule = "/test/change_question/<int:pk>",
    view_func= quiz.render_change_question,
    methods = ["GET", "POST"]
)
quiz.test_pass.add_url_rule(
    rule = "/test/delete_image/<int:pk>",
    view_func= quiz.render_delete_image,
    methods = ["GET", "POST"]
)
quiz.test_pass.add_url_rule(
    rule = "/test/delete_only_image/<int:pk>",
    view_func= quiz.render_delete_only_image,
    methods = ["GET", "POST"]
)

pass_quiz.finish_test.add_url_rule(
    rule = "/finish_test",
    view_func = pass_quiz.render_finish_test,
    methods = ["GET", "POST"]
)

pass_quiz.solo_pass.add_url_rule(
    rule = "/passig_test",
    view_func = pass_quiz.render_passing_test,
    methods = ["GET", "POST"]
)

searches.search.add_url_rule(
    rule="/filter_page",
    view_func= searches.render_data_filter,
    methods = ["GET", "POST"]
)

userprofile.buy_gifts.add_url_rule(
    rule = "/buy_pet",
    view_func = userprofile.render_buy_gifts,
    methods = ["GET", "POST"]
)

userprofile.user_graphics.add_url_rule(
    rule = "/graphics_user",
    view_func = userprofile.render_graphics,
    methods = ["GET", "POST"]
)

online_passing.mentor.add_url_rule(
    rule = "/passing_mentor",
    view_func = online_passing.render_mentor_passing,
    methods = ["GET", "POST"]
)

online_passing.student.add_url_rule(
    rule = "/passing_student",
    view_func = online_passing.render_student_passing,
    methods = ["GET", "POST"]
)


online_passing.mentor.add_url_rule(
    rule = "/mentor",
    view_func = online_passing.render_mentor,
    methods = ["GET","POST"]
)

online_passing.student.add_url_rule(
    rule = "/student",
    view_func = online_passing.render_student,
    methods = ["GET","POST"]
)

online_passing.student.add_url_rule(
    rule="/waiting_student",
    view_func = online_passing.render_wait_student
)

online_passing.student.add_url_rule(
    rule="/result_student",
    view_func = online_passing.render_result_student
)

online_passing.mentor.add_url_rule(
    rule="/result_mentor",
    view_func = online_passing.render_result_mentor
)
online_passing.mentor.add_url_rule(
    rule="/finish_student",
    view_func = online_passing.render_finish_student
)

online_passing.mentor.add_url_rule(
    rule="/finish_mentor",
    view_func = online_passing.render_finish_mentor
)

classes.mentor_class.add_url_rule(
    rule = "/mentor_class",
    view_func = classes.render_mentor_classes,
    methods = ["GET", "POST"]
)
classes.mentor_class.add_url_rule(
    rule = "/create_class",
    view_func = classes.render_create_class,
    methods = ["GET", "POST"]
)

classes.student_class.add_url_rule(
    rule = "/student_class",
    view_func = classes.render_student_classes,
    methods = ["GET", "POST"]
)