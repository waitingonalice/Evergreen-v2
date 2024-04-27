from fastapi import BackgroundTasks, HTTPException

from ...constants.error import ErrorCode
from ...db.utils import transaction
from ...dependencies.validation.auth import (
    LoginBody,
    RegisterBody,
    ResetPasswordBody,
)
from ...models.account import AccountModel
from ...utils import auth, errorHandler
from ..email import EmailService
from .email_content import (
    build_password_confirmation_email_content,
    build_register_email_content,
    build_reset_password_email_content,
)


def generate_registration_email(email: str):
    registered_acc = AccountModel(email=email).get_account()
    if not registered_acc:
        raise HTTPException(status_code=400, detail=ErrorCode.BAD_REQUEST)
    email_content, email_service_deps = build_register_email_content(
        registered_acc["email"], registered_acc["username"]
    )
    email_service = EmailService(**email_service_deps)
    return email_service, email_content, registered_acc


class AuthService:

    def login(self, body: LoginBody):
        username = body.username
        password = body.password
        account = AccountModel(username=username)
        user = account.get_password()
        if not user:
            raise HTTPException(status_code=400, detail=ErrorCode.BAD_REQUEST)
        is_valid_password = auth.verify_password(password, user["password"])
        if not is_valid_password:
            raise HTTPException(status_code=400, detail=ErrorCode.BAD_REQUEST)

        account_details = account.get_account()

        if not account_details["is_active"]:
            raise HTTPException(
                status_code=400, detail=ErrorCode.ACCOUNT_UNVERIFIED
            )
        auth_token = {
            "email": account_details["email"],
            "active": account_details["is_active"],
            "country": account_details["country"],
            "role": account_details["role"],
        }

        refresh_token = {
            "email": account_details["email"],
            "remember_me": body.rememberMe,
        }
        serialize_auth_token = auth.generate_auth_token(**auth_token)
        serialize_refresh_token = auth.generate_refresh_token(**refresh_token)
        return {
            "result": {
                "token": serialize_auth_token,
                "refresh_token": serialize_refresh_token,
            }
        }

    @errorHandler.integrity_error
    def register(self, body: RegisterBody, background_tasks: BackgroundTasks):
        password = body.password
        confirmPassword = body.confirmPassword
        if password != confirmPassword:
            raise HTTPException(
                status_code=400, detail=ErrorCode.PASSWORD_MISMATCH
            )
        hashed_password = auth.hash_password(password)
        body.password = hashed_password
        account = AccountModel(**body.model_dump())
        transaction(lambda conn: account.create_account(conn))
        email_service, email_content, registered_acc = (
            generate_registration_email(body.email)
        )
        background_tasks.add_task(
            email_service.send_email_template, email_content
        )
        return registered_acc

    def regenerate_registration_email(
        self, email: str, background_tasks: BackgroundTasks
    ):
        email_service, email_content, registered_acc = (
            generate_registration_email(email)
        )
        is_active_account = registered_acc["is_active"]
        if is_active_account:
            raise HTTPException(status_code=400, detail=ErrorCode.BAD_REQUEST)
        background_tasks.add_task(
            email_service.send_email_template, email_content
        )
        return registered_acc

    def verify_email(self, token: str):
        email = auth.decode_token(token)["email"]
        account = AccountModel(email=email)
        if account.get_account()["is_active"]:
            return {"result": "ok"}
        transaction(
            lambda conn: account.update_account(conn=conn, is_active=True)
        )
        return {"result": "ok"}

    def forgot_password(self, email: str, background_tasks: BackgroundTasks):
        account = AccountModel(email=email).get_account()
        if not account:
            raise HTTPException(status_code=400, detail=ErrorCode.BAD_REQUEST)
        email_content, email_deps = build_reset_password_email_content(
            account["email"], account["username"]
        )
        email_service = EmailService(**email_deps)
        background_tasks.add_task(
            email_service.send_email_template, email_content
        )
        return {"result": "ok"}

    def reset_password(
        self,
        body: ResetPasswordBody,
        background_tasks: BackgroundTasks,
    ):
        email = auth.decode_token(body.token)["email"]
        password = body.password
        confirmPassword = body.confirmPassword
        if password != confirmPassword:
            raise HTTPException(
                status_code=400, detail=ErrorCode.PASSWORD_MISMATCH
            )
        hashed_password = auth.hash_password(password)
        account = AccountModel(email=email)
        transaction(
            lambda conn: account.update_account(
                conn=conn, password=hashed_password
            )
        )
        acc_details = account.get_account()
        email_content, email_deps = build_password_confirmation_email_content(
            email=acc_details["email"], name=acc_details["username"]
        )
        email_service = EmailService(**email_deps)
        background_tasks.add_task(
            email_service.send_email_template, email_content
        )
        return {"result": "ok"}

    def refresh_token(self, token: str):
        email = auth.decode_token(token)["email"]
        account = AccountModel(email=email)
        account_details = account.get_account()
        if not account_details:
            raise HTTPException(
                status_code=401, detail=ErrorCode.INVALID_TOKEN
            )

        auth_token = {
            "email": account_details["email"],
            "active": account_details["is_active"],
            "country": account_details["country"],
            "role": account_details["role"],
        }

        new_token = auth.generate_auth_token(**auth_token)
        return {"result": new_token}
