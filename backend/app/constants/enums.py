from enum import Enum


class Role(Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class Bucket(Enum):
    RESUME = "resume"


class Timezone(Enum):
    ASIA_SINGAPORE = "Asia/Singapore"
