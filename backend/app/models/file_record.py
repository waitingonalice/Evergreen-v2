from sqlalchemy import Connection, text


class FileRecordModel:

    def __init__(
        self,
        id: str,
        status: str | None = None,
        account_id: str | None = None,
        path: str | None = None,
    ):
        self.id = id
        self.path = path
        self.status = status
        self.account_id = account_id

    def create_file_record(self, conn: Connection):
        statement = """
          INSERT INTO "FileRecord"
          (id, path, status, account_id)
          VALUES (:id, :path, :status, :account_id)
        """
        params = {
            "id": self.id,
            "path": self.path,
            "status": self.status,
            "account_id": self.account_id,
        }
        conn.execute(text(statement), params)

    def update_file_record(self, conn: Connection):
        statement = """
        UPDATE "FileRecord"
        SET path = :path, status = :status
        WHERE id = :id
        """
        params = {
            "id": self.id,
            "path": self.path,
            "status": self.status,
        }

        conn.execute(text(statement), params)
