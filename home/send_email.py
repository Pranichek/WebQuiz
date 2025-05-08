from Project.login_manager import mail, project
from flask_mail import Message

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

