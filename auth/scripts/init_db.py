import subprocess

from app.db import main, schema


def init_db():
    schema.Base.metadata.create_all(bind=main.engine)
    subprocess.run(["alembic", "stamp", "head"])


if __name__ == "__main__":
    init_db()
