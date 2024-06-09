from fastapi import APIRouter, Depends

from ...dependencies import verify
from ...services.system import SystemInfoService

router = APIRouter(
    prefix="/system",
    tags=["System Info"],
    dependencies=[Depends(verify.verify_token)],
)


@router.get("")
def list_hardware_info():
    return SystemInfoService().get_latest_info()
