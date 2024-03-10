# This Python file contains various auxiliary functions
from typing import Any, Callable

from sqlalchemy import Connection, text
from sqlalchemy.exc import SQLAlchemyError

from .main import engine


def query(query_str: str, params=None):
    with engine.connect() as conn:
        result = conn.execute(text(query_str), params)
        return result


def transaction(func: Callable[[Connection], Any]):
    try:
        with engine.connect() as conn:
            trans = conn.begin()
            result = func(conn)
            trans.commit()
            return result
    except SQLAlchemyError as e:
        trans.rollback()
        print(f"Error executing transaction: {str(e)}")
