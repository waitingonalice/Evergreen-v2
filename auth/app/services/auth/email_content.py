import datetime
from datetime import timezone

from ...utils import auth, environment


def build_register_email_content(email: str, username: str):
    token_content = {
        "email": email,
        "exp": datetime.datetime.now(tz=timezone.utc)
        + datetime.timedelta(hours=24),
    }
    token = auth.encode_token(token_content)
    email_content = {
        "name": username,
        "primary_text": "You're almost there! Please click on the button below to verify your email address to complete your registration.",
        "secondary_text": "If you did not request to register an account with us, please ignore this email. This verification is only valid for the next 24 hours.",
        "url": f"{environment.Env.FRONTEND_URL}/verify-email?token={token}&email={email}",
        "button_text": "VERIFY EMAIL",
    }
    email_service_deps = {
        "receiver_address": email,
        "template": "verify-email",
        "subject": "Verify your email address.",
    }
    return email_content, email_service_deps


def build_reset_password_email_content(email: str, name: str):
    token_content = {
        "email": email,
        "exp": datetime.datetime.now(tz=timezone.utc)
        + datetime.timedelta(hours=1),
    }
    token = auth.encode_token(token_content)
    email_content = {
        "name": name,
        "primary_text": "You have requested to reset your password. Please click on the button below to reset your password.",
        "secondary_text": "If you did not request to reset your password, please ignore this email. This verification is only valid for the next 1 hour.",
        "url": f"{environment.Env.FRONTEND_URL}/reset-password?token={token}",
        "button_text": "RESET PASSWORD",
    }
    email_service_deps = {
        "receiver_address": email,
        "template": "verify-email",
        "subject": "Reset your password",
    }
    return email_content, email_service_deps


def build_password_confirmation_email_content(email: str, name: str):
    email_content = {
        "name": name,
        "primary_text": "Your password has been successfully updated.",
        "url": f"{environment.Env.FRONTEND_URL}/login",
        "button_text": "LOGIN",
    }
    email_service_deps = {
        "receiver_address": email,
        "template": "verify-email",
        "subject": "Password updated",
    }
    return email_content, email_service_deps
