from fastapi import APIRouter, BackgroundTasks, Depends

from ...dependencies import verify, verify_token_deps
from ...dependencies.validation.resume import EditResumeBody
from ...services.resume import ResumeService

router = APIRouter(
    prefix="/cv", tags=["CV"], dependencies=[Depends(verify.verify_token)]
)


@router.get("/{id}")
def get_record(id: int, user: verify_token_deps):
    return ResumeService(user).get_record(id)


@router.post("/create")
def create_cv(
    body: EditResumeBody,
    user: verify_token_deps,
    background_task: BackgroundTasks,
):
    return ResumeService(user).create_cv(body, background_task)
