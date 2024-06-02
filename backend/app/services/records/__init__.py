from ...constants.enums import Bucket
from ...dependencies.validation import records
from ...models.account import AccountModel
from ...models.file_record import FileRecordModel
from ...utils.errorHandler import value_error
from ..storage import StorageService


class RecordsService(AccountModel):
    # TODO: update this to use redis cache to fetch user data
    def __init__(self, user: dict | None = None):
        if user:
            super().__init__(email=user["email"])
            self.account = self.get_account()

    def list_records(self, input: records.ListRecordsValidation):
        records = FileRecordModel(
            id=input.id,
            status=input.status,
            filename=input.filename,
            account_id=self.account["id"],
        )
        result = records.list_records(input.index, input.limit)
        if len(result) == 0:
            return {"result": result, "total_count": 0}

        return {"result": result, "total_count": records.get_total_count()}

    @value_error
    def download_record(
        self,
        filename: str,
        bucket: Bucket,
        content_disposition,
        download_name: str | None,
    ):
        url = StorageService(
            username=self.account["username"], bucket=bucket
        ).generate_presigned_url(
            filename=filename,
            download_name=download_name,
            content_disposition=content_disposition,
        )
        return {"result": url}
