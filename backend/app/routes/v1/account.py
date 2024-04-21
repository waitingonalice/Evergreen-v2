from fastapi import APIRouter
from pydantic import EmailStr

from ...services.account import AccountService

router = APIRouter(prefix="/account", tags=["Account"])


@router.get("/me")
def get_me(email: EmailStr):
    return AccountService(email=email).get_me()
