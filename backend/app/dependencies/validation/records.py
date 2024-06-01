from ...constants.enums import Status
from . import PaginationValidation


class ListRecordsValidation(PaginationValidation):
    status: Status | None = None
    filename: str | None = None
