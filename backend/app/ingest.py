from pathlib import Path

from app.database import SessionLocal
from app.models import Document, DocumentChunk
from app.services.embeddings import get_embedding

DATA_DIR = Path("data/python-3.13-docs-text")


def get_all_text_files() -> list[Path]:
    return list(DATA_DIR.rglob("*.txt"))


def read_text_file(file_path: Path) -> str:
    return file_path.read_text(encoding="utf-8")


def split_into_chunks(
    content: str,
    chunk_size: int = 500,
    overlap: int = 100,
) -> list[str]:

    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size")

    chunks = []

    start = 0

    while start < len(content):
        end = start + chunk_size

        chunk = content[start:end]

        chunks.append(chunk)

        start += chunk_size - overlap

    return chunks


def ingest_documents():

    session = SessionLocal()

    try:
        files = get_all_text_files()

        print(f"Found {len(files)} files\n")

        for file_path in files:

            print(f"Processing: {file_path}")

            # -------------------------
            # Read File
            # -------------------------
            content = read_text_file(file_path)

            # -------------------------
            # Create Document
            # -------------------------
            document = Document(
                filename=file_path.name,
                relative_path=str(file_path),
                category=file_path.parent.name,
            )
            session.add(document)
            session.commit()
            session.refresh(document)

            # -------------------------
            # Split Into Chunks
            # -------------------------
            chunks = split_into_chunks(content)

            print(f"Characters : {len(content)}")
            print(f"Total Chunks : {len(chunks)}")

            # -------------------------
            # Create Embeddings & Save Chunks
            # -------------------------
            for i, chunk in enumerate(chunks):

                vector = get_embedding(chunk)

                chunk_obj = DocumentChunk(
                    document_id=document.id,
                    chunk_index=i,
                    content=chunk,
                    embedding=vector,
                )

                session.add(chunk_obj)

            session.commit()

            print(f"Saved {len(chunks)} chunks.\n")

    finally:
        session.close()


if __name__ == "__main__":
    ingest_documents()
