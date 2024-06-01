class ErrorCode:
    # Common
    BAD_REQUEST = 400000
    INVALID_PARAMETER = 400001
    MISSING_EMAIL_CLIENT_CREDS = 400002
    UNIQUE_CONSTRAINT = 400003
    NOT_FOUND = 404000
    # Auth
    UNAUTHORIZED = 401000
    TOKEN_EXPIRED = 401001
    INVALID_TOKEN = 401002
    INCORRECT_ANSWER = 401003
    EXPIRED_TOKEN = 401004
    PASSWORD_MISMATCH = 401005
    ACCOUNT_UNVERIFIED = 401006
    # System
    INTERNAL_SERVER_ERROR = 500000
