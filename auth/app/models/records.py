from sqlalchemy import Connection, text

from ..constants.enums import Bucket, Status
from ..db.utils import query


class RecordsModel:

    def __init__(
        self,
        id: str | None = None,
        account_id: str | None = None,
        type: Bucket | None = None,
        status: Status | None = None,
    ):
        self.id = id
        self.account_id = account_id
        self.status = status.value if status else None
        self.type = type.value if type else None

        self.list_filters = """
        (:filename IS NULL OR POSITION(:filename IN f.name) > 0)
        AND (:status IS NULL OR :status = r.status)
        AND (:record_type IS NULL OR :record_type = r.type)
        AND (:id IS NULL OR :id = r.id)
        AND (:account = account_id)
        """

    def create_record(self, conn: Connection):
        statement = """
          INSERT INTO "Records"
          (id, status, type, account_id)
          VALUES (:id, :status, :type, :account_id)
        """
        params = {
            "id": self.id,
            "status": self.status,
            "type": self.type,
            "account_id": self.account_id,
        }
        conn.execute(text(statement), params)

    def update_record_status(self, conn: Connection):
        statement = """
        UPDATE "Records"
        SET status = :status
        WHERE id = :id
        """
        params = {
            "id": self.id,
            "status": self.status,
        }

        conn.execute(text(statement), params)

    def list_records(self, index: int, limit: int, filename: str):
        statement = f"""
        SELECT r.id, f.name, f.size, r.status, r.created_at, r.type
        FROM "Records" as r
        JOIN "Files" as f
        ON r.id = f.record_id
        WHERE {self.list_filters}
        ORDER BY created_at DESC
        LIMIT :limit
        OFFSET :index
        """
        params = {
            "id": self.id,
            "account": self.account_id,
            "record_type": self.type,
            "filename": filename,
            "status": self.status,
            "limit": limit,
            "index": index,
        }

        result = query(statement, params)
        return result.mappings().all()

    def get_total_count(self, filename: str) -> int:
        statement = f"""
        SELECT COUNT(*) as total_count
        FROM "Records" as r
        JOIN "Files" as f
        ON r.id = f.record_id
        WHERE {self.list_filters}
        """
        params = {
            "id": self.id,
            "account": self.account_id,
            "record_type": self.type,
            "filename": filename,
            "status": self.status,
        }
        result = query(statement, params).mappings().first()
        return result["total_count"] if result else 0
