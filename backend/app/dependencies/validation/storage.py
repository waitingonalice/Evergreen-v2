from typing import Annotated, Optional

from pydantic import BaseModel, Field

from ...constants.enums import ContentDispositionEnum, MediaTypeEnum


class FileParamFields(BaseModel):
    path: Annotated[str, Field(description="Path to the file")]

    content_disposition: Annotated[
        Optional[ContentDispositionEnum],
        Field(description="Content-Disposition header"),
    ] = None

    content_type: Annotated[
        Optional[MediaTypeEnum], Field(description="Content-Type header")
    ] = None

    filename: Annotated[
        Optional[str], Field(description="Name of the file")
    ] = None
