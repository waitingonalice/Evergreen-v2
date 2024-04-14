from fastapi import BackgroundTasks

from ...constants.error import ErrorCode
from ...db.utils import transaction
from ...models.account import AccountModel
from ...utils import auth, environment, errorHandler
from ..email import EmailService
from .utils import build_email_content
from .validation import RegisterBody


class AuthService:

    def login(self) -> None:
        pass

    @errorHandler.valueErrorHandler
    def register(
        self, fields: RegisterBody, background_tasks: BackgroundTasks
    ):
        answer = environment.Env.SECRET_ANSWER
        if fields.secret != answer:
            raise ValueError(ErrorCode.INCORRECT_ANSWER)

        del fields.secret
        hashed_password = auth.encrypt(fields.password)
        fields.password = hashed_password
        account = AccountModel(**fields.model_dump())
        id = transaction(lambda conn: account.create_account(conn))

        registered_acc: dict = account.get_account(id=id)
        email_content, email_service_deps = build_email_content(
            registered_acc["email"], fields
        )
        email_service = EmailService(**email_service_deps)
        background_tasks.add_task(
            email_service.send_email_template, email_content
        )
        return registered_acc

    def forgot_password(self) -> None:
        pass

    def reset_password(self) -> None:
        pass

    def verify_email(self) -> None:
        pass
