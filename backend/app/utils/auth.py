from cryptography.fernet import Fernet

from ..utils.environment import Env


def encrypt(message: str) -> str:
    return Fernet(Env.SECRET_TOKEN.encode()).encrypt(message.encode()).decode()


def decrypt(message: str) -> str:
    return Fernet(Env.SECRET_TOKEN.encode()).decrypt(message.encode()).decode()
