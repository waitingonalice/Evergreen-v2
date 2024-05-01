from fastapi import APIRouter, BackgroundTasks, Depends

from ...dependencies.validation.cv import EditResumeBody
from ...dependencies.verify import verify_token
from ...services.cv import ResumeService

router = APIRouter(
    prefix="/cv", tags=["CV"], dependencies=[Depends(verify_token)]
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
def edit_cv(body: EditResumeBody, background_task: BackgroundTasks):
    return ResumeService().edit_cv(body, background_task)
