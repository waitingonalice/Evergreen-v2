from typing import Annotated

from pydantic import BaseModel, Field


class PaginationValidation(BaseModel):
    limit: Annotated[int, Field(description="limit", gt=0, le=100)] = 10
    index: Annotated[int, Field(description="index", ge=0)] = 0
