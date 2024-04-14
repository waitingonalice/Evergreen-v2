from typing import Callable

from fastapi import HTTPException

from ..constants.error import ErrorCode


def valueErrorHandler(func: Callable) -> Callable:
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            print(repr(e))
            raise HTTPException(
                status_code=500, detail=ErrorCode.INTERNAL_SERVER_ERROR
            )

    return wrapper
