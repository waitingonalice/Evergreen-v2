from typing import Optional

from fastapi import Header, HTTPException, Request

from ..constants.enums import Role
from ..constants.error import ErrorCode
from ..utils.auth import decode_token


class Token:
    email: str
    active: bool
    role: Role
    country: str


def verify_token(
    request: Request, token: Optional[str] = Header(None)
) -> Token:
    header_token = request.headers.get("Authorization")

    if header_token is None and token is None:
        raise HTTPException(status_code=401, detail=ErrorCode.UNAUTHORIZED)
    try:
        return decode_token(header_token or token or "")
    except Exception as e:
        if "expired" in str(e):
            raise HTTPException(
                status_code=401, detail=ErrorCode.EXPIRED_TOKEN
            )
        raise HTTPException(status_code=401, detail=ErrorCode.INVALID_TOKEN)
