import json
from uuid import uuid4

from fastapi import BackgroundTasks, HTTPException
from sqlalchemy import Connection

from ...constants import enums, error
from ...db.utils import transaction
from ...dependencies.validation.resume import EditResumeBody, ExperienceModel
from ...models.account import AccountModel
from ...models.file_record import FileRecordModel
from ...models.resume import ResumeModel
from ...services.storage.file import File
from ...utils.errorHandler import value_error
from .utils import generate_cv


class ResumeService:
    @value_error
    def __init__(self, user: dict):
        account = AccountModel(email=user["email"]).get_account()
        self.account = account
        if account is None:
            raise ValueError(error.ErrorCode.UNAUTHORIZED)

    # Creates new record in database to store updated values for cv while generates a new cv
    def create_cv(
        self,
        body: EditResumeBody,
        background_task: BackgroundTasks,
    ):
        try:
            uuid = str(uuid4())
            file_record = FileRecordModel(
                status=enums.Status.PENDING.value,
                account_id=self.account["id"],
                id=uuid,
            )
            resume = ResumeModel(file_record_id=uuid)

            def format_date(model: ExperienceModel):
                model.start = model.start.strftime("%Y-%B")
                model.end = model.end.strftime("%Y-%B")
                return model

            formatted_data = [format_date(exp) for exp in body.experiences]

            body.experiences = formatted_data
            stringify_content = body.model_dump_json()

            def add_entries(conn: Connection):
                file_record.create_file_record(conn)
                resume.create_cv_record(conn, content=stringify_content)

            transaction(add_entries)

            background_task.add_task(self.trigger_job, body=body, file_id=uuid)
            return body
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail=error.ErrorCode.INTERNAL_SERVER_ERROR
            )

    def trigger_job(self, body: EditResumeBody, file_id: str):
        file_props = {
            "id": file_id,
            "status": enums.Status.SUCCESS.value,
        }
        try:
            dirname = generate_cv(body, self.account)
            file_props.update({"path": dirname})

        except Exception as e:
            print(e)
            file_props.update({"status": enums.Status.FAILED.value})

        finally:
            file_record = FileRecordModel(**file_props)
            transaction(file_record.update_file_record)

    @value_error
    def get_record(self, id: int):
        data = ResumeModel(
            id=id, account_id=self.account["id"]
        ).get_cv_record()
        if data is None:
            raise ValueError(error.ErrorCode.BAD_REQUEST)
        content = json.loads(data["content"])
        return {"result": content}

    def list_edits(self, limit: int, index: int):
        data = ResumeModel(account_id=self.account["id"]).list_cv_records(
            limit, index
        )

        def format_record(record: dict):
            resource_url = File.build_resource_url(
                path=record["path"],
                media_type=enums.MediaTypeEnum.PDF,
                content=enums.ContentDispositionEnum.INLINE,
            )
            return {**record, "resource_url": resource_url}

        response = [format_record(record) for record in data]

        return {"result": response}
