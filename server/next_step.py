import json
import os
from typing import List

from load_ai_clients import load_openai_client, load_together_client
from models import LLMGetIdsResponse
from utils import Timer


def get_next_step(tag_details: str, prompt: str) -> str:
    client = load_together_client()

    print(tag_details)

    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Here is a JSON with some key information on interactive elements for the webpage that I'm on: \n\n{tag_details}.\n\n The task that I would like to complete is {prompt}. \n\nJust return the single next step I should do and nothing else. For example you might say 'Click on the sidebar.' or 'Click the marketplace button'",
            },
        ],
        model="mistralai/Mixtral-8x7B-Instruct-v0.1",
        max_tokens=100,
    )

    return response.choices[0].message.content


def get_relevant_tag_ids(next_step: str, tags: str) -> str:
    client = load_together_client()
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
