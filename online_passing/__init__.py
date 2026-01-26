from .apps import mentor, student
from .views import render_mentor, render_student
from .passing_views import render_mentor_passing, render_student_passing, render_wait_student, render_result_student, render_result_mentor, render_finish_mentor, render_finish_student, render_online_page
from .socket_manager import *
from .socket_student import *
from .mentor_socket import *
from .leave_test import *
from .ajax_request import *