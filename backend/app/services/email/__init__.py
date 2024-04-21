import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from jinja2 import Template

from ...constants.error import ErrorCode
from ...utils.environment import Env
from ...utils.formatting import find_file


class EmailService:
    smtp_server = "smtp.gmail.com"
    PORT = 465

    def __init__(
        self,
        receiver_address: str,
        subject: str | None = None,
        template: str | None = None,
    ):
        """Send an email with a template.
        template: The directory path of the email template.
        receiver_address: The email address of the receiver.
        subject: The subject of the email.
        """
        self.sender_address = Env.EMAIL_ADDRESS
        self.sender_password = Env.EMAIL_PASSWORD
        self.template = template
        self.receiver_address = receiver_address
        self.subject = subject

        email_client = MIMEMultipart("alternative")
        email_client["From"] = self.sender_address
        email_client["To"] = self.receiver_address
        if self.subject:
            email_client["Subject"] = self.subject
        self.email_client = email_client

    def send_email_template(self, content: dict) -> None:
        if (
            not self.template
            or not self.sender_address
            or not self.sender_password
        ):
            raise ValueError(ErrorCode.MISSING_EMAIL_CLIENT_CREDS)

        html_template_path = find_file(self.template)
        with open(f"{html_template_path}/index.html") as file:
            html = file.read()
            template = Template(html)
            render_content = template.render(**content)
            self.email_client.attach(MIMEText(render_content, "html"))
            file.close()

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(
            host=self.smtp_server, port=self.PORT, context=context
        ) as email_server:
            email_server.login(self.sender_address, self.sender_password)
            email_server.sendmail(
                self.sender_address,
                self.receiver_address,
                self.email_client.as_string(),
            )
            print(
                f"Email sent successfully! Receiver: {self.receiver_address}"
            )
