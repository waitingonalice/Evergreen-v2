from sqlalchemy import Connection, text

from ..db.utils import query


class SystemInfoModel:

    def insert_info(
        self,
        conn: Connection,
        device_name: str,
        cpu_info: str,
        memory_info: str,
    ):
        statement = """
        INSERT INTO "SystemInfo" (device_name, cpu, memory)
        VALUES (:device_name, :cpu_info, :memory_info)
        """
        params = {
            "device_name": device_name,
            "cpu_info": cpu_info,
            "memory_info": memory_info,
        }
        conn.execute(text(statement), params)

    def list_latest_info(self):
        statement = """
         SELECT DISTINCT ON (device_name) * FROM "SystemInfo"
         ORDER BY device_name, id DESC
        """
        return query(statement).mappings().all()
