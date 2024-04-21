from fastapi import HTTPException

from ...constants.error import ErrorCode
from ...models.account import AccountModel


class AccountService(AccountModel):
    def __init__(self, **data):
        super().__init__(**data)

    def get_me(self):
        account = self.get_account()
        if not account:
            raise HTTPException(status_code=404, detail=ErrorCode.BAD_REQUEST)
        return account
