from fastapi import APIRouter, BackgroundTasks, Depends

from ...dependencies import verify, verify_token_deps
from ...dependencies.validation.resume import EditResumeBody
from ...services.resume import ResumeService

router = APIRouter(
    prefix="/cv", tags=["CV"], dependencies=[Depends(verify.verify_token)]
)


# Returns details of latest CV
@router.get("/me")
def get_me():
    return ResumeService().me()


# Returns list of past edited CVs
@router.get("/records")
def list_edits():
    return ResumeService().list_edits()


@router.post("/edit")
def edit_cv(
    body: EditResumeBody,
    user: verify_token_deps,
    background_task: BackgroundTasks,
):
    return ResumeService().edit_cv(body, user, background_task)
