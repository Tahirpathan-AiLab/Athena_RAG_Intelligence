import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()


client = Groq(api_key=os.getenv("GROQ_API_KEY")) if os.getenv("GROQ_API_KEY") else None


def generate_answer(prompt: str) -> str:
    if client is None:
        context_section = (
            prompt.split("Context:", 1)[1].split("Question:", 1)[0].strip()
            if "Context:" in prompt
            else ""
        )
        question = (
            prompt.split("Question:", 1)[1].split("Answer:", 1)[0].strip()
            if "Question:" in prompt
            else ""
        )
        return (
            f"I answered this using the indexed document snippets because no Groq API key is configured.\n\n"
            f"Question: {question}\n\n"
            f"Context preview: {context_section[:1600]}"
        )

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content


if __name__ == "__main__":
    answer = generate_answer("Explain Python in simple words.")
    print("\nAnswer:\n")
    print(answer)
