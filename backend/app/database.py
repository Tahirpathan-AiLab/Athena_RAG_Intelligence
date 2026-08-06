from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

connect_args = (
    {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)
engine = create_engine(
    settings.DATABASE_URL, echo=settings.DB_ECHO, connect_args=connect_args
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


if settings.USE_POSTGRES:
    try:
        from pgvector.psycopg2 import register_vector
    except ImportError:
        register_vector = None

    @event.listens_for(engine, "connect")
    def _register_pgvector(dbapi_connection, _connection_record):
        if register_vector is not None:
            register_vector(dbapi_connection)

    with engine.begin() as connection:
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
