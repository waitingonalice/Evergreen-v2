from typing import Optional
from uuid import uuid4

from sqlalchemy import Connection, text

from ..constants.enums import Role
from ..db.utils import query


class AccountModel:
    email: Optional[str]
    username: Optional[str]
    password: Optional[str]
    role: Optional[Role]
    country: Optional[str]
    is_active: Optional[bool]

    def __init__(
        self,
        email: Optional[str] = None,
        username: Optional[str] = None,
        password: Optional[str] = None,
        role: Optional[Role] = Role.USER,
        country: Optional[str] = None,
        is_active: Optional[bool] = False,
    ):
        self.email = email
        self.username = username
        self.password = password
        self.role = role
        self.country = country
        self.is_active = is_active

    def create_account(self, conn: Connection):
        id = uuid4()
        statement = """
        INSERT INTO "Account"
        (id, email, username, password, role, country, is_active)
        VALUES (:id, :email, :username, :password, :role, :country, :is_active)
        """
        params = {
            "id": id,
            "email": self.email,
            "username": self.username,
            "password": self.password,
            "country": self.country,
            "is_active": self.is_active,
        }
        if self.role:
            params["role"] = self.role.value
        conn.execute(text(statement), params)
        return id

    def get_account(
        self,
        id: str | None = None,
        email: str | None = None,
        username: str | None = None,
    ):
        query_statement = """
        SELECT id, email, username, role, country, is_active
        FROM "Account"
        WHERE id = :id OR email = :email OR username = :username
        """
        params = {"id": id, "email": email, "username": username}
        result = query(query_statement, params).mappings().one()
        return result

    def forgot_password(self, conn: Connection):
        pass

    def refresh_token(self):
        pass

    def reset_password(self):
        pass
