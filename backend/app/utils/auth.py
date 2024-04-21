import jwt
from cryptography.fernet import Fernet

from ..utils.environment import Env


def encrypt(message: str) -> str:
    return Fernet(Env.SECRET_TOKEN.encode()).encrypt(message.encode()).decode()


def decrypt(message: str) -> str:
    return Fernet(Env.SECRET_TOKEN.encode()).decrypt(message.encode()).decode()


def encode_token(payload: dict) -> str:
    return jwt.encode(payload, Env.SECRET_TOKEN, algorithm="HS256")


def decode_token(token: str) -> dict:
    return jwt.decode(token, Env.SECRET_TOKEN, algorithms=["HS256"])
