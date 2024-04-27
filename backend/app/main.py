from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db.utils import query
from .routes import v1

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


v1.endpoint(app)


@app.get("/")
def health_check():
    data = (
        query(
            """
    SELECT * FROM "Account";
    """
        )
        .mappings()
        .all()
    )
    return {"status": "ok", "data": data}
