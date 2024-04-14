from ...constants.error import ErrorCode
from ...db.utils import transaction
from ...models.account import AccountModel
from ...utils import auth, environment, errorHandler
from .validation import RegisterBody


class AuthService:

    def login(self) -> None:
        pass

    @errorHandler.valueErrorHandler
    def register(self, fields: RegisterBody) -> None:
        answer = environment.Env.SECRET_ANSWER
        if fields.secret != answer:
            raise ValueError(ErrorCode.INCORRECT_ANSWER)

        del fields.secret
        hashed_password = auth.encrypt(fields.password)
        fields.password = hashed_password
        account = AccountModel(**fields.model_dump())
        id = transaction(lambda conn: account.create_account(conn))

        # TODO: Send email verification
        return account.get_account(id=id)

    def forgot_password(self) -> None:
        pass

    def reset_password(self) -> None:
        pass

    def verify_email(self) -> None:
        pass
