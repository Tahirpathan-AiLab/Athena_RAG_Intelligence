import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    use_sqlite = os.getenv("USE_SQLITE", "true").lower() == "true"
    database_url = os.getenv("DATABASE_URL")
    DATABASE_URL = (
        "sqlite:///./data/simple_rag.db"
        if use_sqlite and not os.getenv("USE_POSTGRES")
        else (database_url or "sqlite:///./data/simple_rag.db")
    )
    DB_ECHO = os.getenv("DB_ECHO", "false").lower() == "true"
    USE_POSTGRES = DATABASE_URL.startswith("postgresql")
    EMBEDDING_DIMENSION = int(os.getenv("EMBEDDING_DIMENSION", "384"))


settings = Settings()
