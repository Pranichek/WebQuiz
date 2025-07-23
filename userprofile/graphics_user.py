import flask, os
from Project.login_check import login_decorate
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as pyplot
from os.path import abspath, join, exists
from flask_login import current_user

@login_decorate
def render_graphics():
    graphics_tests = current_user.user_profile.last_passed.split() #["1/1,1/0/0.0", "2/1,2/0/0.0", "3/1,3/0/0.0"]
    for graphic_index in range(len(graphics_tests)):
        current_data = graphics_tests[graphic_index].split("/") # ["1", "1,1", "0", "0.0"]
        # "0.0" => ["0", "0"]
        graphics_tests[graphic_index] = int(current_data[-1].split(".")[0])

    
    list_index = []
    for index in range(1 , len(graphics_tests) + 1):
        list_index.append(index)

    figure, ax = pyplot.subplots(figsize=(10, 5))
    
    pyplot.figure()
    pyplot.plot(list_index, graphics_tests, color='#FFB700', marker='o',
    markerfacecolor='#C99208', markersize=5)
    pyplot.title("test_graphic")

    pyplot.xticks(list_index)

    # ax.plot(list_index, graphics_tests, color="gray", linewidth=3)
    # pyplot.plot(color="red")
    pyplot.show()
    
    user_directory = abspath(join(__file__, "..", "static", "images", "edit_avatar", f"{current_user.email}", "graphics_user"))
    if not exists(user_directory):
        os.mkdir(user_directory)
        image_path = join(user_directory, "test_graphic.png")
        pyplot.savefig(image_path)
        
    else:
        image_path = join(user_directory, "test_graphic.png")
        pyplot.savefig(image_path)

    # graphic_images = flask.url_for(user_directory) 
    right_directory = abspath(join(__file__, "..", "static", "images", "edit_avatar", f"{current_user.email}", "graphics_user"))

    return flask.render_template(
        template_name_or_list = "graphics_user.html",
        graphic_images = user_directory,
        user = current_user
    )