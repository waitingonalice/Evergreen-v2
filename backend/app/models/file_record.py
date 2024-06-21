from sqlalchemy import Connection, text

from ..constants.enums import Bucket, ContentTypeEnum, Status
from ..db.utils import query


class FileRecordModel:

    def __init__(
        self,
        id: str | None = None,
        account_id: str | None = None,
        self_hosted_id: str | None = None,
        filename: str | None = None,
        filesize: int | None = None,
        type: Bucket | None = None,
        status: Status | None = None,
        filetype: ContentTypeEnum = ContentTypeEnum.OCTET_STREAM,
    ):
        self.id = id
        self.filename = filename
        self.account_id = account_id
        self.self_hosted_id = self_hosted_id
        self.filesize = filesize
        self.status = status.value if status else None
        self.type = type.value if type else None
        self.filetype = filetype.value

        self.list_filters = """
        (:filename IS NULL OR POSITION(:filename IN filename) > 0)
        AND (:status IS NULL OR :status = status)
        AND (:record_type IS NULL OR :record_type = type)
        AND (:id IS NULL OR :id = id)
        AND (:account = account_id)
        """

    def create_file_record(self, conn: Connection):
        statement = """
          INSERT INTO "FileRecord"
          (id, filename, status, filesize, account_id, type, filetype, self_hosted_id)
          VALUES (:id, :filename, :status, :filesize, :account_id, :type, :filetype, :self_hosted_id)
        """
        params = {
            "id": self.id,
            "filename": self.filename,
            "status": self.status,
            "account_id": self.account_id,
            "filesize": self.filesize,
            "type": self.type,
            "filetype": self.filetype,
            "self_hosted_id": self.self_hosted_id,
        }
        conn.execute(text(statement), params)

    def update_file_record(self, conn: Connection):
        statement = """
        UPDATE "FileRecord"
        SET filename = :filename, status = :status, filesize = :filesize
        WHERE id = :id
        """
        params = {
            "id": self.id,
            "filename": self.filename,
            "status": self.status,
            "filesize": self.filesize,
        }

        conn.execute(text(statement), params)

    def list_records(self, index: int, limit: int):
        statement = f"""
        SELECT id, filename, filesize, status, created_at, type FROM "FileRecord"
        WHERE {self.list_filters}
        ORDER BY created_at DESC
        LIMIT :limit
        OFFSET :index
        """
        params = {
            "id": self.id,
            "account": self.account_id,
            "record_type": self.type,
            "filename": self.filename,
            "status": self.status,
            "limit": limit,
            "index": index,
        }

        result = query(statement, params)
        return result.mappings().all()

    def get_total_count(self) -> int:
        statement = f"""
        SELECT COUNT(*) as total_count FROM "FileRecord"
        WHERE {self.list_filters}
        """
        params = {
            "id": self.id,
            "account": self.account_id,
            "record_type": self.type,
            "filename": self.filename,
            "status": self.status,
        }
        result = query(statement, params).mappings().first()
        return result["total_count"] if result else 0
