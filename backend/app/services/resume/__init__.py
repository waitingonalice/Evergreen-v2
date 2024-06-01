import json
from datetime import date
from typing import Any
from uuid import uuid4

from fastapi import BackgroundTasks, HTTPException
from sqlalchemy import Connection

from ...constants import enums, error
from ...db.utils import transaction
from ...dependencies.validation.resume import EditResumeBody
from ...models.account import AccountModel
from ...models.file_record import FileRecordModel
from ...models.resume import ResumeModel
from ...utils.errorHandler import value_error
from ..storage import StorageService
from .utils import generate_pdf


class ResumeService(AccountModel):
    # TODO: update this to use redis cache to fetch user data
    def __init__(self, user: dict | None = None):
        if user:
            super().__init__(email=user["email"])
            self.account = self.get_account()

    def trigger_job(self, content: dict[str, Any], file_id: str):
        file_props: dict = {
            "id": file_id,
            "status": enums.Status.SUCCESS,
            "filesize": 0,
            "filename": "",
        }
        try:
            pdf_blob = generate_pdf(content)
            if pdf_blob is None:
                raise ValueError(error.ErrorCode.INTERNAL_SERVER_ERROR)
            storage = StorageService(
                username=self.account["username"], bucket=enums.Bucket.RESUME
            )
            filename = f"{file_id}.pdf"
            filesize = len(pdf_blob)
            storage.save(
                pdf_blob, filename, filesize, enums.ContentTypeEnum.PDF
            )
            file_props.update({"filename": filename, "filesize": filesize})

        except Exception as e:
            print(e)
            file_props.update({"status": enums.Status.FAILED})

        finally:
            file_record = FileRecordModel(**file_props)
            transaction(file_record.update_file_record)

    # Creates new record in database to store updated values for cv while generates a new cv
    def create_cv(
        self,
        body: EditResumeBody,
        background_task: BackgroundTasks,
    ):
        try:
            uuid = str(uuid4())
            file_record = FileRecordModel(
                status=enums.Status.PENDING,
                account_id=self.account["id"],
                id=uuid,
                type=enums.Bucket.RESUME,
            )
            resume = ResumeModel(file_record_id=uuid)

            body_dict = body.model_dump()

            def format_date(model: dict[str, Any]):
                update = model.copy()
                start_date: date = update["start"]
                end_date: date = update["end"]
                update["start"] = start_date.strftime("%Y-%B")
                update["end"] = end_date.strftime("%Y-%B")
                return update

            formatted_experience = [
                format_date(exp) for exp in body_dict["experiences"]
            ]
            formatted_projects = [
                {**exp, "link": str(exp["link"])}
                for exp in body_dict["projects"]
            ]

            body_dict["experiences"] = formatted_experience
            body_dict["projects"] = formatted_projects
            stringify_content = json.dumps(body_dict)

            def add_entries(conn: Connection):
                file_record.create_file_record(conn)
                resume.create_cv_record(conn, content=stringify_content)

            transaction(add_entries)
            background_task.add_task(
                self.trigger_job, content=body_dict, file_id=uuid
            )
            return {"result": uuid}

        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail=error.ErrorCode.INTERNAL_SERVER_ERROR
            )

    @value_error
    def get_cv(self, file_record_id: str):
        data = ResumeModel(file_record_id=file_record_id).get_cv_record()
        if data is None:
            raise ValueError(error.ErrorCode.BAD_REQUEST)
        content = json.loads(data["content"])
        return {"result": content}
