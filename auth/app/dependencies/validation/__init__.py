from typing import Annotated, Optional

from pydantic import BaseModel, Field

from ...constants.enums import ContentTypeEnum


class PaginationValidation(BaseModel):
    limit: Annotated[int, Field(description="limit", gt=0, le=100)] = 10
    index: Annotated[int, Field(description="index", ge=0)] = 0


class FileValidation(BaseModel):
    filename: str
    filetype: Optional[ContentTypeEnum] = None
    filesize: Optional[int] = None
    src: Optional[str] = None
