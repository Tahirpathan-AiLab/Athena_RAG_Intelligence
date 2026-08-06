from app.services.retrieval import search
from app.services.prompt import build_prompt
from app.services.llm import generate_answer

# Minimum similarity score a retrieved chunk must have to be treated as
# "actually relevant" to the question. Casual messages like "hello" still
# get *some* nearest-neighbour chunks back from the vector search (that's
# just how similarity search works — it always returns the closest matches,
# even if none of them are a good match), so without this filter every
# message ends up showing sources.
#
# Tune this by printing `item["score"]` for a real document question vs.
# a greeting like "hello" and picking a cutoff that separates them. 0.5 is
# a reasonable starting point for cosine-similarity-style scores (0-1
# range); raise it if greetings still slip through, lower it if genuine
# answers start losing their sources.
SIMILARITY_THRESHOLD = 0.3


def ask(question: str):
    results = search(question)

    # Only keep chunks that clear the relevance bar. Everything downstream
    # (the context handed to the LLM, the sources shown to the user, and
    # the chunk count) is built from this filtered list instead of the
    # raw search results.
    relevant_results = [
        item for item in results if item["score"] >= SIMILARITY_THRESHOLD
    ]

    chunks = [item["content"] for item in relevant_results]
    prompt = build_prompt(question, chunks)
    answer = generate_answer(prompt)

    return {
        "answer": answer,
        "sources": [
            {
                "document": item["document"],
                "document_id": item["document_id"],
                "chunk_index": item["chunk_index"],
                "score": item["score"],
            }
            for item in relevant_results
        ],
        "similarity": round(
            max((item["score"] for item in relevant_results), default=0.0), 4
        ),
        "chunks": len(relevant_results),
    }


if __name__ == "__main__":
    answer = ask("What is Python?")

    print("\nFinal Answer:\n")
    print(answer)