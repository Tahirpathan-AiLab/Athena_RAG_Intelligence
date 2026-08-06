import math
import re
from sqlalchemy import select

from app.database import SessionLocal
from app.models import DocumentChunk
from app.services.embeddings import get_embedding


def _as_vector(values) -> list[float]:
    if hasattr(values, "tolist"):
        return [float(value) for value in values.tolist()]
    return [float(value) for value in values]


def _cosine_similarity(left: list[float], right: list[float]) -> float:
    if not left or not right or len(left) != len(right):
        return 0.0

    dot_product = sum(a * b for a, b in zip(left, right))
    left_norm = math.sqrt(sum(value * value for value in left))
    right_norm = math.sqrt(sum(value * value for value in right))

    if left_norm == 0 or right_norm == 0:
        return 0.0

    return dot_product / (left_norm * right_norm)


def search(query: str, limit: int = 5):
    if not query.strip():
        return []

    query_embedding = get_embedding(query)

    # Words from the query used for a simple keyword-match boost. Sentence
    # embedding models like all-MiniLM-L6-v2 compare overall *meaning*, so
    # they often under-score exact matches on proper nouns (names, IDs,
    # filenames) even when the word appears verbatim in the chunk. This
    # keyword boost is a lightweight hybrid-search fix for that gap.
    #
    # Common words are excluded so the boost only fires on specific terms
    # (like a name) rather than every chunk that happens to contain a
    # generic word like "explain" or "about".
    STOPWORDS = {
        "the",
        "and",
        "for",
        "are",
        "but",
        "not",
        "you",
        "all",
        "can",
        "explain",
        "about",
        "what",
        "who",
        "when",
        "where",
        "why",
        "how",
        "does",
        "did",
        "this",
        "that",
        "with",
        "from",
        "have",
        "has",
        "please",
        "tell",
        "give",
        "know",
        "information",
        "provide",
        "detail",
        "details",
        "more",
        "context",
        "regarding",
        "describe",
    }
    query_words = [
        word
        for word in (w.lower() for w in re.findall(r"\w+", query))
        if len(word) > 2 and word not in STOPWORDS
    ]

    session = SessionLocal()

    try:
        chunks = session.scalars(select(DocumentChunk)).all()
        scored_chunks = []

        for chunk in chunks:
            score = _cosine_similarity(query_embedding, _as_vector(chunk.embedding))

            content_lower = chunk.content.lower()
            if any(word in content_lower for word in query_words):
                score = max(score, 0.75)

            if score <= 0:
                continue
            scored_chunks.append(
                {
                    "content": chunk.content,
                    "document": (
                        chunk.document.filename if chunk.document else "Unknown"
                    ),
                    "document_id": chunk.document_id,
                    "chunk_index": chunk.chunk_index,
                    "score": round(score, 4),
                }
            )

        scored_chunks.sort(key=lambda item: item["score"], reverse=True)
        return scored_chunks[:limit]
    finally:
        session.close()


if __name__ == "__main__":
    results = search("What is Python?")

    for result in results:
        print("\n---")
        print(result["content"])
