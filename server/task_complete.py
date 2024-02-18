from load_ai_clients import load_together_client
from typing import List


def is_complete(prompt: str, previous_steps: List[str]):
    client = load_together_client()
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Has the task'{prompt}' been completed based on the following previous steps done by the user: '{previous_steps}'. Answer just 'Yes' or 'No', one word.",
            }
        ],
        model="meta-llama/Llama-2-70b-chat-hf",
        max_tokens=1,
    )

    return response == "Yes"