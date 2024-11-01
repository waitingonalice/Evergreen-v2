from sqlalchemy import Connection, text

from ..constants.enums import ContentTypeEnum


class FilesModel:

    def __init__(
        self,
        self_hosted_id: str | None = None,
        record_id: str | None = None,
        name: str | None = None,
        size: int | None = None,
        type: ContentTypeEnum = ContentTypeEnum.OCTET_STREAM,
        src: str | None = None,
    ):
        self.name = name
        self.size = size
        self.type = type.value
        self.src = src
        self.record_id = record_id
        self.self_hosted_id = self_hosted_id

        self.list_filters = """
        (:filename IS NULL OR POSITION(:filename IN filename) > 0)
        AND (:status IS NULL OR :status = status)
        AND (:record_type IS NULL OR :record_type = record_type)
        AND (:id IS NULL OR :id = id)
        AND (:account = account_id)
        """

    def create_file(self, conn: Connection):
        statement = """
          INSERT INTO "Files"
          (name, size, type, src, self_hosted_id, record_id)
          VALUES (:name, :size, :type, :src, :self_hosted_id, :record_id)
        """
        params = {
            "name": self.name,
            "size": self.size,
            "type": self.type,
            "src": self.src,
            "self_hosted_id": self.self_hosted_id,
            "record_id": self.record_id,
        }
        conn.execute(text(statement), params)

    def update_file_entry_records(self, conn: Connection):
        statement = """
        UPDATE "Files"
        SET name = :name, size = :size, type = :type
        WHERE record_id = :record_id
        """
        params = {
            "record_id": self.record_id,
            "name": self.name,
            "size": self.size,
            "type": self.type,
        }

        conn.execute(text(statement), params)
