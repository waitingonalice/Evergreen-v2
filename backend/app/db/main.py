from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from ..utils.environment import Env, getEnv


def get_database_url():
    if getEnv("IN_DOCKER"):
        return Env.DATABASE_DOCKER_URL
    return Env.DATABASE_URL


engine = create_engine(
    # To handle the case where we are not accessing the database from a docker compose network within the same machine (production)
    url=get_database_url() or Env.DATABASE_URL or "",
    pool_size=20,
    max_overflow=0,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
