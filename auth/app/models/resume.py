from sqlalchemy import Connection, text

from ..db.utils import query


class ResumeModel:
    def __init__(
        self,
        id: int | None = None,
        record_id: str | None = None,
    ):
        self.record_id = record_id
        self.id = id

    def create_resume(self, conn: Connection, content: str):
        statement = """
          INSERT INTO "Resume"
          (record_id, content)
          VALUES (:record_id, :content)
        """
        params = {
            "record_id": self.record_id,
            "content": content,
        }
        conn.execute(text(statement), params)

    def get_resume(self):
        statement = """
        SELECT content FROM "Resume"
        WHERE :record_id = record_id
        """
        params = {"record_id": self.record_id}
        result = query(statement, params)
        return result.mappings().first()
