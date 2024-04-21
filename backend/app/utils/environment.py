import os


def getEnv(key: str):
    return os.getenv(key)


class Env:
    DATABASE_URL = getEnv("DATABASE_URL")
    DATABASE_DOCKER_URL = getEnv("DATABASE_DOCKER_URL")
    SECRET_TOKEN = getEnv("SECRET_TOKEN")
    SECRET_ANSWER = getEnv("SECRET_ANSWER")
    EMAIL_ADDRESS = getEnv("SUPPORT_EMAIL_ADDRESS")
    EMAIL_PASSWORD = getEnv("SUPPORT_EMAIL_PASSWORD")
    FRONTEND_URL = getEnv("FRONTEND_URL")
