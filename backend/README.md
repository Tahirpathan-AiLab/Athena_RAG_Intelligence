# RAG Chat Prototype

React chat UI + FastAPI backend + pgvector retrieval + Groq generation.

## Run it

**1. Start Postgres (with pgvector)**
```
docker compose up -d
```

**2. Backend**
```
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
copy .env.example .env       # Windows
# or use cp .env.example .env on macOS/Linux
python -m uvicorn app.main:app --reload --port 8000
```
If `uvicorn` is not found, start it with `python -m uvicorn app.main:app --reload --port 8000`.
First run downloads the local embedding model (~90MB), so give it a minute.

**3. Load some documents**
```
python ingest_sample_docs.py
```
Or POST your own text to `/ingest`:
```
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{"source": "notes.txt", "text": "Your document content here..."}'
```

**4. Frontend**
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 and ask a question about the ingested docs.

## What's what
- `backend/rag.py` — chunking, embeddings (local `all-MiniLM-L6-v2`), pgvector search, Groq call
- `backend/main.py` — FastAPI routes: `/ask`, `/ingest`, `/health`
- `frontend/src/App.jsx` — chat state + API calls
- `frontend/src/components/` — message bubbles (with source chips) and the input box

See the full walkthrough and "what to extend first" notes in the chat response this was delivered with.
