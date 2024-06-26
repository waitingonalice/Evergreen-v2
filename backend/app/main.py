from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import v1

app = FastAPI()

origins = ["http://localhost:3000", "https://reallyboringsite.com"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


v1.endpoint(app)
