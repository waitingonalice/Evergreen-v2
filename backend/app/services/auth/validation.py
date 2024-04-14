from pydantic import BaseModel, EmailStr

from ...models.account import Role


class RegisterBody(BaseModel):
    email: EmailStr
    username: str
    password: str
    role: Role
    country: str
    secret: str
