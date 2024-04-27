from fastapi import APIRouter, BackgroundTasks

from ...dependencies.validation import auth as validation
from ...services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login(body: validation.LoginBody):
    return AuthService().login(body)


@router.post("/register")
def register(body: validation.RegisterBody, background_tasks: BackgroundTasks):
    return AuthService().register(body, background_tasks)


@router.post("/confirmation-email")
def resend_registration_verification(
    body: validation.ForgotPasswordBody, background_tasks: BackgroundTasks
):
    return AuthService().regenerate_registration_email(
        body.email, background_tasks
    )


@router.post("/verify-email")
def verify_email(body: validation.ValidateToken):
    return AuthService().verify_email(body.token)


@router.post("/forgot-password")
def forgot_password(
    body: validation.ForgotPasswordBody, background_tasks: BackgroundTasks
):
    return AuthService().forgot_password(
        email=body.email, background_tasks=background_tasks
    )


@router.post("/reset-password")
def reset_password(
    body: validation.ResetPasswordBody, background_tasks: BackgroundTasks
):
    return AuthService().reset_password(
        body=body, background_tasks=background_tasks
    )


@router.post("/refresh-token")
def refresh_token(body: validation.ValidateToken):
    return AuthService().refresh_token(body.token)
