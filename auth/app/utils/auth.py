import datetime

import jwt
from bcrypt import checkpw, gensalt, hashpw

from ..utils.environment import Env

key = Env.SECRET_TOKEN


def hash_password(password: str) -> str:
    salt = gensalt()
    password_hash = hashpw(password.encode(), salt)
    return password_hash.decode()


def verify_password(password: str, hashed_password: str) -> bool:
    return checkpw(password.encode(), hashed_password.encode())


def encode_token(payload: dict) -> str:
    return jwt.encode(payload, key, algorithm="HS256")


def decode_token(token: str) -> dict:
    return jwt.decode(token, key, algorithms=["HS256"])


def generate_auth_token(
    id: str, email: str, active: bool, role: str, country: str
):
    expiry = datetime.datetime.now(
        tz=datetime.timezone.utc
    ) + datetime.timedelta(hours=1)
    return encode_token(
        {
            "id": id,
            "email": email,
            "active": active,
            "country": country,
            "role": role,
            "exp": expiry,
        }
    )


def generate_refresh_token(email: str, remember_me: bool):
    expiry = datetime.datetime.now(
        tz=datetime.timezone.utc
    ) + datetime.timedelta(days=30 if remember_me else 1)
    return encode_token({"email": email, "exp": expiry})
