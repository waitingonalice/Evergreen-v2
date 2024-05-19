from fastapi import APIRouter, BackgroundTasks, Depends

from ...dependencies import verify, verify_token_deps
from ...dependencies.validation.resume import EditResumeBody, ListResumeRecords
from ...services.resume import ResumeService

router = APIRouter(
    prefix="/cv", tags=["CV"], dependencies=[Depends(verify.verify_token)]
)


# Returns list of past edited CVs
@router.get("/records")
def list_edits(user: verify_token_deps, query: ListResumeRecords = Depends()):
    return ResumeService(user).list_edits(index=query.index, limit=query.limit)


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
