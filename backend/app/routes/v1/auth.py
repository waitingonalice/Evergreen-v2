from fastapi import APIRouter

from ...constants.routes import routerV1

router = APIRouter(f"{routerV1}")


@router.post("/register")
def register():
    pass


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
