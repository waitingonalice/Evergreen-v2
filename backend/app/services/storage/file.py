import os
from typing import Any

from fastapi import HTTPException, status
from fastapi.responses import FileResponse

from ...constants import enums, routes
from ...dependencies.validation.storage import FileParamFields
from ...utils import environment


class File:

    @staticmethod
    def serve_file(params: FileParamFields):
        """Serve a file from the specified path."""
        if not os.path.isfile(params.path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
            )
        default_file_name = os.path.basename(params.path)
        file_response_args: dict[str, Any] = {
            "path": params.path,
        }

        if params.content_disposition:
            file_response_args["headers"] = {
                "Content-Disposition": f"{params.content_disposition.value}; filename={params.filename or default_file_name}"
            }

        if params.content_type:
            file_response_args["media_type"] = params.content_type.value
        return FileResponse(**file_response_args)

    @staticmethod
    def build_resource_url(
        path: str,
        media_type: enums.MediaTypeEnum,
        content: enums.ContentDispositionEnum,
    ):
        url = "{endpoint}/file/resource?path={filepath}&media_type={media_type}&content_disposition={content}".format(
            endpoint=f"{environment.Env.ENDPOINT_URL}/{routes.route_v1}",
            filepath=path,
            media_type=media_type.value,
            content=content.value,
        )

        return url
