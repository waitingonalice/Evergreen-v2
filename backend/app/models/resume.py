from sqlalchemy import Connection, text

from ..db.utils import query


class ResumeModel:
    def __init__(
        self,
        id: int | None = None,
        file_record_id: str | None = None,
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
        SELECT content FROM "Resume"
        WHERE :file_record_id = file_record_id
        """
        params = {"file_record_id": self.file_record_id}
        result = query(statement, params)
        return result.mappings().first()
