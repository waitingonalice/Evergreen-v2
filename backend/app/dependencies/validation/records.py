from ...constants.enums import Bucket, Status
from . import PaginationValidation


class ListRecordsValidation(PaginationValidation):
    filename: str | None = None
    id: str | None = None
    record_type: Bucket | None = None
    status: Status | None = None
