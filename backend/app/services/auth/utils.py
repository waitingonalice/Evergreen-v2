import datetime
from datetime import timezone

from ...utils import auth, environment
from .validation import RegisterBody


def build_email_content(email: str, fields: RegisterBody):
    token_content = {
        "email": email,
        "exp": datetime.datetime.now(tz=timezone.utc)
        + datetime.timedelta(hours=24),
    }
    token = auth.encode_token(token_content)
    email_content = {
        "name": fields.username,
        "primary_text": "You're almost there! Please click on the button below to verify your email address to complete your registration.",
        "secondary_text": "If you did not request to register an account with us, please ignore this email. This verification is only valid for the next 24 hours.",
        "url": f"{environment.Env.FRONTEND_URL}/verify-email?token={token}",
        "button_text": "VERIFY EMAIL",
    }
    email_service_deps = {
        "receiver_address": fields.email,
        "template": "verify-email",
        "subject": "Verify your email address.",
    }
    return email_content, email_service_deps
