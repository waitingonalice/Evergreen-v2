from sqlalchemy import Connection, text


class ResumeModel:
    def __init__(self, file_record_id: str | None):
        self.file_record_id = file_record_id

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
