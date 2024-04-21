from fastapi import HTTPException
from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)

from ...constants.error import ErrorCode
from ...models.account import Role
from ...utils import environment
from ...utils.auth import decode_token


class ValidateToken(BaseModel):
    token: str

    @field_validator("token")
    def validate_token(cls, value):
        try:
            decode_token(value)
            return value
        except Exception as e:
            if "expired" in str(e):
                raise HTTPException(
                    status_code=400, detail=ErrorCode.EXPIRED_TOKEN
                )
            raise HTTPException(
                status_code=400, detail=ErrorCode.INVALID_TOKEN
            )


class RegisterBody(BaseModel):
    email: EmailStr
    username: str = Field(
        min_length=8,
        max_length=20,
    )
    password: str = Field(
        min_length=8,
        max_length=14,
    )
    role: Role
    country: str
    secret: str

    @model_validator(mode="after")
    def validate_secret(self):
        if self.secret != environment.Env.SECRET_ANSWER:
            raise HTTPException(
                status_code=400, detail=ErrorCode.INCORRECT_ANSWER
            )
        del self.secret
        return self


class ForgotPasswordBody(BaseModel):
    email: EmailStr


class ResetPasswordBody(ValidateToken):
    password: str = Field(
        min_length=8,
        max_length=14,
    )
