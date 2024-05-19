from sqlalchemy import Connection, text

from ..db.utils import query


class ResumeModel:
    def __init__(
        self,
        file_record_id: str | None = None,
        id: int | None = None,
        account_id: str | None = None,
    ):
        self.file_record_id = file_record_id
        self.id = id
        self.account_id = account_id

    def create_cv_record(self, conn: Connection, content: str):
        statement = """
          INSERT INTO "Resume"
          (file_record_id, content)
          VALUES (:file_record_id, :content)
        """
        params = {
            "file_record_id": self.file_record_id,
            "content": content,
        }
        conn.execute(text(statement), params)

    def get_cv_record(self):
        statement = """
        WITH resume AS (
            SELECT rs.id, rs.content, fr.path, fr.account_id
            FROM "Resume" rs
            JOIN "FileRecord" fr
            ON rs.file_record_id = fr.id
            WHERE rs.id = :id
        )
        SELECT rs.id, rs.content, rs.path FROM resume rs
        JOIN "Account" ac
        ON rs.account_id = ac.id
        WHERE ac.id = :account_id
        """
        params = {"id": self.id, "account_id": self.account_id}
        result = query(statement, params)
        return result.mappings().first()

    def list_cv_records(self, limit: int, index: int):
        statement = """
        WITH resume_records AS (
            SELECT rs.id, rs.created_at, rs.file_record_id, fr.id as file_id, fr.path, fr.status, fr.account_id
            FROM "FileRecord" fr JOIN "Resume" rs
            ON fr.id = rs.file_record_id
        )
        SELECT rs.id, rs.created_at, rs.path, rs.status
        FROM resume_records rs JOIN "Account" ac
        ON rs.account_id = ac.id
        WHERE ac.id = :account_id
        LIMIT :limit OFFSET :index
        """
        params = {
            "limit": limit,
            "index": index,
            "account_id": self.account_id,
        }
        result = query(statement, params)
        return result.mappings().all()
