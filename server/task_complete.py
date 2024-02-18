from load_ai_clients import load_together_client


def is_complete(prompt: str, html: str):
    client = load_together_client()
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Can this task: '{prompt}' be completed on this page? Use the following HTML to answer: '{html}'. Answer just 'Yes' or 'No', one word.",
            }
        ],
        model="meta-llama/Llama-2-70b-chat-hf",
        max_tokens=1,
    )

    return response == "Yes"