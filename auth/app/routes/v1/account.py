from fastapi import APIRouter

from ...dependencies import verify_token_deps
from ...services.account import AccountService

router = APIRouter(prefix="/account", tags=["Account"])


@router.get("/me")
def get_me(user: verify_token_deps):
    return AccountService(email=user["email"]).get_me()
