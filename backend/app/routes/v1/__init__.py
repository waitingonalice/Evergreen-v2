from fastapi import FastAPI

from ...constants.routes import routerV1
from . import account, auth, monitoring, records, resume


def endpoint(app: FastAPI):
    app.include_router(auth.router, prefix=routerV1)
    app.include_router(account.router, prefix=routerV1)
    app.include_router(resume.router, prefix=routerV1)
    app.include_router(records.router, prefix=routerV1)
    app.include_router(monitoring.router, prefix=routerV1)
