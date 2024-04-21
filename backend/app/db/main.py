from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from ..utils.environment import Env, getEnv


def get_database_url():
    if getEnv("IN_DOCKER"):
        return Env.DATABASE_DOCKER_URL
    return Env.DATABASE_URL


engine = create_engine(
    get_database_url() or "",
    pool_size=20,
    max_overflow=0,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
