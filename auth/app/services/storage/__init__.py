import io
from datetime import timedelta

from minio import Minio

from ...constants.enums import Bucket, ContentDispositionEnum, ContentTypeEnum
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
        content_type: ContentTypeEnum = ContentTypeEnum.OCTET_STREAM,
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
                content_type=content_type.value,
            )
        except Exception as e:
            print(e)
            raise

    def get(self, filename: str):
        object_name = f"{self.username}/{self.bucket}/{filename}"
        response = self.get_object(
            bucket_name=self.root, object_name=object_name
        )
        data = response.read()
        response.close()
        response.release_conn()
        return data

    def generate_presigned_url(
        self,
        filename: str,
        expiry: int = 1,
        content_disposition: ContentDispositionEnum = ContentDispositionEnum.ATTACHMENT,
        download_name: str | None = None,
    ):
        """
        Get presigned url for download.
        :param filename: name of the file to download
        :param expiry: time in days for the url to expire
        """
        object_name = f"{self.username}/{self.bucket}/{filename}"

        return self.presigned_get_object(
            bucket_name=self.root,
            object_name=object_name,
            expires=(timedelta(expiry)),
            response_headers={
                "response-content-disposition": f"{content_disposition.value}; filename={download_name or filename}"
            },
        )
