from fastapi import APIRouter, Depends

from ...dependencies.validation.storage import FileParamFields
from ...services.storage.file import File

router = APIRouter(prefix="/storage")


@router.get("/file")
def get_file_resource(params: FileParamFields = Depends()):
    return File.serve_file(params)
