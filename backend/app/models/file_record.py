from sqlalchemy import Connection, text


class FileRecordModel:

    def __init__(
        self,
        id: str,
        status: str | None = None,
        account_id: str | None = None,
        filename: str | None = None,
        filesize: int | None = None,
    ):
        self.id = id
        self.filename = filename
        self.status = status
        self.account_id = account_id
        self.filesize = filesize

    def create_file_record(self, conn: Connection):
        statement = """
          INSERT INTO "FileRecord"
          (id, filename, status, filesize, account_id)
          VALUES (:id, :filename, :status, :filesize, :account_id)
        """
        params = {
            "id": self.id,
            "filename": self.filename,
            "status": self.status,
            "account_id": self.account_id,
            "filesize": self.filesize,
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
