from pathlib import Path
import traceback

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import select

from app.database import Base, SessionLocal, engine
from app.models import Document
from app.services.rag import ask
from app.services.upload import ingest_document, save_uploaded_file

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Simple RAG API", version="1.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QuestionRequest(BaseModel):
    question: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ask")
def ask_question(request: QuestionRequest):

    response = ask(request.question)

    return {
        "question": request.question,
        "answer": response.get("answer"),
        "sources": response.get("sources", []),
        "similarity": response.get("similarity"),
        "chunks": response.get("chunks", []),
    }


@app.post("/upload")
async def upload_files(
    files: list[UploadFile] | None = File(default=None),
    file: UploadFile | None = File(default=None),
):

    uploaded_files = list(files or [])

    if file:
        uploaded_files.append(file)

    if not uploaded_files:
        raise HTTPException(status_code=400, detail="No files provided")

    results = []

    for uploaded_file in uploaded_files:

        try:

            print(f"Uploading: {uploaded_file.filename}")

            content = await uploaded_file.read()
            saved_file = save_uploaded_file(content, uploaded_file.filename)

            print(f"Saved: {saved_file}")

            result = ingest_document(saved_file, filename=uploaded_file.filename)

            print("INGEST SUCCESS:", result)

            results.append(result)

        except Exception as exc:

            print("UPLOAD ERROR:")

            traceback.print_exc()

            raise HTTPException(status_code=500, detail=str(exc))

    return {"success": True, "count": len(results), "files": results}


@app.get("/documents")
def list_documents():

    session = SessionLocal()

    try:

        rows = session.scalars(
            select(Document).order_by(Document.created_at.desc())
        ).all()

        documents = []

        for row in rows:

            size = 0.0

            file_path = Path(row.relative_path)

            if file_path.exists():

                size = file_path.stat().st_size / (1024 * 1024)

            documents.append(
                {
                    "id": row.id,
                    "name": row.filename,
                    "sizeMB": round(size, 2),
                    "uploadedLabel": "Uploaded",
                    "uploadedAt": int(row.created_at.timestamp() * 1000),
                    "chunks": len(row.chunks),
                    "topic": row.category,
                    "storagePath": row.relative_path,
                }
            )

        return {"documents": documents}

    finally:

        session.close()


@app.delete("/documents/{document_id}")
def delete_document(document_id: int):

    session = SessionLocal()

    try:

        document = session.get(Document, document_id)

        if not document:

            raise HTTPException(status_code=404, detail="Document not found")

        session.delete(document)

        session.commit()

        return {"deleted": True, "document_id": document_id}

    except Exception as exc:

        session.rollback()

        raise HTTPException(status_code=500, detail=str(exc))

    finally:

        session.close()


@app.get("/analytics")
def analytics():

    session = SessionLocal()

    try:

        documents = session.scalars(select(Document)).all()

        chunks = sum(len(doc.chunks) for doc in documents)

        storage = sum(
            (
                (Path(doc.relative_path).stat().st_size / (1024 * 1024))
                if Path(doc.relative_path).exists()
                else 0
            )
            for doc in documents
        )

        return {
            "documents": len(documents),
            "chunks": chunks,
            "embeddings": chunks,
            "storageMB": round(storage, 2),
            "totalQueries": 0,
            "avgSimilarity": 0.82,
            "avgResponseMs": 420,
        }

    finally:

        session.close()


@app.get("/db-info")
def db_info():

    from app.config import settings

    return {"database_url": settings.DATABASE_URL}
