import os
import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("DATABASE_URL", "sqlite:///test_simple_rag.db")

from app.database import Base, engine
from app.models import Document, DocumentChunk
from app.main import app
from app.services.upload import ingest_document
from app.services.retrieval import search
from app.services.rag import ask

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_ingest_document_and_retrieve_relevant_chunk():
    with tempfile.TemporaryDirectory() as tmpdir:
        file_path = Path(tmpdir) / "sample.txt"
        file_path.write_text(
            "Python is a popular programming language used for web development and automation.",
            encoding="utf-8",
        )

        result = ingest_document(file_path, filename="sample.txt")

        assert result["chunks"] >= 1
        assert result["document_id"] is not None

        matches = search("What is Python used for?")
        assert matches
        assert any("programming language" in match["content"] for match in matches)


def test_ask_returns_structured_response():
    response = ask("What is this document about?")

    assert isinstance(response, dict)
    assert "answer" in response
    assert "sources" in response
    assert "similarity" in response
    assert "chunks" in response


def test_upload_accepts_single_file_field():
    with tempfile.TemporaryDirectory() as tmpdir:
        file_path = Path(tmpdir) / "sample.txt"
        file_path.write_text(
            "Python is useful for automation and data science.", encoding="utf-8"
        )

        with file_path.open("rb") as handle:
            response = client.post(
                "/upload",
                files={"file": (file_path.name, handle, "text/plain")},
            )

    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 1
    assert data["files"][0]["chunks"] >= 1
