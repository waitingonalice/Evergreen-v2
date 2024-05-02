from fastapi import APIRouter, BackgroundTasks, Depends

from ...dependencies import verify, verify_token_deps
from ...dependencies.validation.resume import EditResumeBody
from ...services.resume import ResumeService

router = APIRouter(
    prefix="/cv", tags=["CV"], dependencies=[Depends(verify.verify_token)]
)


# Returns list of past edited CVs
@router.get("/records")
def list_edits():
    return ResumeService().list_edits()


@router.get("/{record_id}")
def get_record(record_id: str):
    return ResumeService().fetch_cv_record(record_id)


@router.post("/create")
def create_cv(
    body: EditResumeBody,
    user: verify_token_deps,
    background_task: BackgroundTasks,
):
    return ResumeService(user).create_cv(body, background_task)
