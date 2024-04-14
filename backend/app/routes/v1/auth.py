from fastapi import APIRouter, BackgroundTasks

from ...constants.routes import routerV1
from ...services.auth import AuthService, validation

router = APIRouter(prefix=f"{routerV1}/auth")


@router.post("/register")
def register(
    fields: validation.RegisterBody, background_tasks: BackgroundTasks
):
    return AuthService().register(fields, background_tasks)


@router.post("/login")
def login():
    pass


@router.post("/refresh-token")
def refresh_token():
    pass


@router.post("/forgot-password")
def forgot_password():
    pass


@router.post("/reset-password")
def reset_password(token: str):
    pass


@router.post("/verify-email")
def verify_email(token: str):
    pass
