import json
from datetime import datetime
from typing import Any
from uuid import uuid4

from fastapi import BackgroundTasks, HTTPException
from sqlalchemy import Connection

from ...constants import enums, error
from ...db.utils import transaction
from ...dependencies.validation.resume import EditResumeBody
from ...models.account import AccountModel
from ...models.files import FilesModel
from ...models.records import RecordsModel
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

    def trigger_job(self, content: dict[str, Any], record_id: str):
        file_props: dict = {
            "record_id": record_id,
            "size": 0,
            "name": "",
            "type": enums.ContentTypeEnum.PDF,
        }
        record_props = {
            "status": enums.Status.SUCCESS,
            "id": record_id,
        }
        try:
            pdf_blob = generate_pdf(content)
            if pdf_blob is None:
                raise ValueError(error.ErrorCode.INTERNAL_SERVER_ERROR)
            storage = StorageService(
                username=self.account["username"], bucket=enums.Bucket.RESUME
            )
            filename = f"{record_id}.pdf"
            filesize = len(pdf_blob)
            storage.save(
                pdf_blob, filename, filesize, enums.ContentTypeEnum.PDF
            )
            file_props.update({"name": filename, "size": filesize})

        except Exception as e:
            print(e)
            record_props.update({"status": enums.Status.FAILED})

        finally:

            def update_entries(conn: Connection):
                record = RecordsModel(**record_props)
                file = FilesModel(**file_props)
                record.update_record_status(conn)
                file.update_file_entry_records(conn)

            transaction(update_entries)

    # Creates new record in database to store updated values for cv while generates a new cv
    def create_cv(
        self,
        body: EditResumeBody,
        background_task: BackgroundTasks,
    ):
        try:
            uuid = str(uuid4())
            record = RecordsModel(
                status=enums.Status.PENDING,
                account_id=self.account["id"],
                id=uuid,
                type=enums.Bucket.RESUME,
            )
            file_model = FilesModel(record_id=uuid)
            resume = ResumeModel(record_id=uuid)

            body_dict = body.model_dump()

            def format_experience(model: dict[str, Any]):
                update = model.copy()
                start_date: datetime = update["start"]
                end_date: datetime = update["end"]
                update["start"] = start_date.strftime("%B %Y")
                if end_date is not None:
                    update["end"] = end_date.strftime("%B %Y")
                return update

            formatted_experience = [
                format_experience(exp) for exp in body_dict["experiences"]
            ]
            formatted_projects = [
                {**exp, "link": str(exp["link"])}
                for exp in body_dict["projects"]
            ]

            body_dict["projects"] = formatted_projects
            body_dict["experiences"] = formatted_experience

            stringify_content = json.dumps(body_dict)

            def add_entries(conn: Connection):
                record.create_record(conn)
                file_model.create_file(conn)
                resume.create_resume(conn, content=stringify_content)

            transaction(add_entries)
            background_task.add_task(
                self.trigger_job, content=body_dict, record_id=uuid
            )
            return {"result": uuid}

        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail=error.ErrorCode.INTERNAL_SERVER_ERROR
            )

    @value_error
    def get_cv(self, file_record_id: str):
        data = ResumeModel(record_id=file_record_id).get_resume()
        if data is None:
            raise ValueError(error.ErrorCode.BAD_REQUEST)
        content = json.loads(data["content"])
        for exp in content["experiences"]:
            exp["start"] = datetime.strptime(exp["start"], "%B %Y")
            if exp["end"] is not None:
                exp["end"] = datetime.strptime(exp["end"], "%B %Y")

        return {"result": content}
