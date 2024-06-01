from fastapi import APIRouter, Depends

from ...constants.enums import Bucket, ContentDispositionEnum
from ...dependencies import verify, verify_token_deps
from ...dependencies.validation import records
from ...services.records import RecordsService

router = APIRouter(
    prefix="/records",
    tags=["File Records"],
    dependencies=[Depends(verify.verify_token)],
)


@router.get("")
def list_records(
    user: verify_token_deps, input: records.ListRecordsValidation = Depends()
):
    return RecordsService(user).list_records(input)


@router.get("/download/{bucket}/{filename}")
def download_record(
    bucket: Bucket,
    filename: str,
    user: verify_token_deps,
    content_disposition: ContentDispositionEnum = ContentDispositionEnum.ATTACHMENT,
    download_name: str | None = None,
):
    return RecordsService(user).download_record(
        filename=filename,
        bucket=bucket,
        download_name=download_name,
        content_disposition=content_disposition,
    )
