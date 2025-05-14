from Project.login_manager import mail, project
from flask_mail import Message
import random


def generate_code():
    str_code = ''
    for num in range(6):
        random_num = random.randint(0,9)
        str_code += str(random_num)

    return str_code

def send_code(recipient: str, code: int):
    with project.app_context():
        msg = Message(
            subject = 'Hello from the other side!', 
            recipients = [str(recipient)] 
        )

        msg.html = f"""
            <html>
                <body>
                    <h1>Привіт, друже!</h1>
                    <p>Твій код підтвердження: {code}</p>
                </body>
            </html>
            """
        print("da")
        mail.send(msg)

