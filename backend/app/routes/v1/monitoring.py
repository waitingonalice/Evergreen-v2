from fastapi import APIRouter, Depends

from ...dependencies import verify
from ...services.monitoring import MonitoringService

router = APIRouter(
    prefix="/monitor",
    tags=["Monitoring Info"],
    dependencies=[Depends(verify.verify_token)],
)


@router.get("/hardware")
def list_hardware_info():
    return MonitoringService().get_latest_hardware_info()


@router.post("/self-hosted")
def save_self_hosted_info():
    return MonitoringService().save_selfhosted_app()


@router.get("/self-hosted")
def list_self_hosted_apps():
    return MonitoringService().list_self_hosted_apps()


@router.get("/self-hosted/{id}")
def get_self_hosted_app(id: str):
    return MonitoringService().get_self_hosted_app(id)
