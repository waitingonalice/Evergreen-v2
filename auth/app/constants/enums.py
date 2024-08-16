from enum import Enum


class Role(Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class Bucket(Enum):
    RESUME = "resume"


class Timezone(Enum):
    ASIA_SINGAPORE = "Asia/Singapore"


class Status(Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"


class ContentTypeEnum(Enum):
    PDF = "application/pdf"
    CSV = "text/csv"
    XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    JSON = "application/json"
    ZIP = "application/zip"
    PNG = "image/png"
    JPEG = "image/jpeg"
    SVG = "image/svg+xml"
    HTML = "text/html"
    TEXT = "text/plain"
    XML = "application/xml"
    MP4 = "video/mp4"
    MOV = "video/quicktime"
    MP3 = "audio/mpeg"
    WEBM = "video/webm"
    OCTET_STREAM = "application/octet-stream"


class ContentDispositionEnum(Enum):
    INLINE = "inline"
    ATTACHMENT = "attachment"
    FORM_DATA = "form-data"
