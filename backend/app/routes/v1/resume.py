from fastapi import APIRouter, BackgroundTasks, Depends

from ...dependencies import verify, verify_token_deps
from ...dependencies.validation.resume import EditResumeBody
from ...services.resume import ResumeService

router = APIRouter(
    prefix="/cv", tags=["CV"], dependencies=[Depends(verify.verify_token)]
)


@router.get("/{file_record_id}")
def get_record(file_record_id: str):
    return ResumeService().get_cv(file_record_id)


@router.post("/create")
def create_cv(
    body: EditResumeBody,
    user: verify_token_deps,
    background_task: BackgroundTasks,
):
    return ResumeService(user).create_cv(body, background_task)
