import io

from minio import Minio

from ...constants.enums import Bucket, MediaTypeEnum
from ...utils.environment import Env


class StorageService(Minio):
    def __init__(
        self,
        username: str,
        bucket: Bucket,
    ):
        super().__init__(
            endpoint=Env.MINIO_URL,
            access_key=Env.MINIO_ACCESS_KEY,
            secret_key=Env.MINIO_SECRET_KEY,
            secure=True,
            cert_check=True,
        )

        self.root = "evergreen"
        self.username = username
        self.bucket = bucket.value

    def save(
        self,
        file: bytes | str,
        filename: str,
        filesize: int,
        content_type: MediaTypeEnum | None = None,
    ):
        try:
            binary_data = io.BytesIO(
                file if isinstance(file, bytes) else file.encode()
            )
            path = f"{self.username}/{self.bucket}/{filename}"
            self.put_object(
                bucket_name=self.root,
                object_name=path,
                data=binary_data,
                length=filesize,
                content_type=content_type.value if content_type else None,
            )
        except Exception as e:
            print(e)
            raise

    # def get(self, key: str):
    #     return self.storage.get(key)

    # def delete(self, key: str):
    #     return self.storage.delete(key)
