import os

from sentence_transformers import SentenceTransformer

model_name = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
model = SentenceTransformer(model_name)


def get_embedding(text: str) -> list[float]:
    embedding = model.encode(text, convert_to_numpy=False)
    return [float(value) for value in embedding.tolist()]
