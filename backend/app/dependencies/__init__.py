from typing import Annotated

from fastapi import Depends

from .verify import verify_token

verify_token_deps = Annotated[dict, Depends(verify_token)]
