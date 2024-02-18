import json
import os
from typing import List

from load_ai_clients import load_openai_client, load_together_client
from models import LLMGetIdsResponse
from utils import Timer


def get_next_step(previous_steps: List[str], prompt: str) -> str:
    client = load_together_client()

    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"These are the steps that I've performed already: \"{' '.join(previous_steps)}\". The task that I would like to complete is {prompt}. Just return the single next step I should do and nothing else. Do not say anything like \"sure, the next step is...\".",
            },
        ],
        model="meta-llama/Llama-2-70b-chat-hf",
        max_tokens=100,
    )

    return response.choices[0].message.content


def get_relevant_tag_ids(next_step: str, tags: str) -> str:
    client = load_openai_client()
    prompt = (
        "Here is the description for the next step: \n"
        + next_step
        + "\nHere is the JSON representation of the relevant HTML tags on the page: \n"
        + tags
        + ".\n Using this information, which tags from the JSON are relevant to the next step? Just return the ids of the relevant tags in a list."
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        response_format={
            "type": "json_object",
            "schema": LLMGetIdsResponse.model_json_schema(),
        },
        model="togethercomputer/CodeLlama-34b-Instruct",
        max_tokens=100,
    )
    
    print(chat_completion.choices[0].message.content)
    response = json.loads(chat_completion.choices[0].message.content)
    relevant_tag_ids = response.get("ids", [])
    
    return relevant_tag_ids
