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
            subject="Підтвердження акаунту — Planet.Quiz", 
            recipients=[str(recipient)] 
        )

        msg.html = f"""
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    color: #333;
                    text-align: center;
                    padding: 30px;
                }}
                .container {{
                    background: #ffffff;
                    max-width: 500px;
                    margin: auto;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
                }}
                h1 {{
                    color: #4CAF50;
                }}
                .code {{
                    font-size: 22px;
                    font-weight: bold;
                    color: #2c3e50;
                    background: #f1f1f1;
                    padding: 10px 20px;
                    border-radius: 8px;
                    display: inline-block;
                    margin: 15px 0;
                }}
                .footer {{
                    font-size: 12px;
                    color: #777;
                    margin-top: 20px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Привіт від <span style="color:#4CAF50;">Planet.Quiz</span> 🌍</h1>
                <p>Дякуємо, що приєднався до нашої спільноти! ✨</p>
                <p>Ось твій код підтвердження:</p>
                <div class="code">{code}</div>
                <p>Введи його на сайті, щоб завершити реєстрацію.</p>
                <div class="footer">
                    <p>Якщо ти не реєструвався на Planet.Quiz — просто ігноруй цей лист.</p>
                </div>
            </div>
        </body>
        </html>
        """

        mail.send(msg)

