from typing import Callable

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from ..constants.error import ErrorCode


def value_error(func: Callable) -> Callable:
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValueError as e:
            error_code = int(str(e))
            status_code = error_code[:3]
            raise HTTPException(status_code=status_code, detail=error_code)
        except Exception as e:
            print(repr(e))
            raise HTTPException(
                status_code=500, detail=ErrorCode.INTERNAL_SERVER_ERROR
            )

    return wrapper


def integrity_error(func: Callable) -> Callable:
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except IntegrityError:
            raise HTTPException(
                status_code=400, detail=ErrorCode.UNIQUE_CONSTRAINT
            )
        except Exception as e:
            print(repr(e))
            raise HTTPException(
                status_code=500, detail=ErrorCode.INTERNAL_SERVER_ERROR
            )

    return wrapper
