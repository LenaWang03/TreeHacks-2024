from load_ai_clients import load_together_client

client = load_together_client()

def get_url(prompt: str):
    response = client.chat.completions.create(
        messages=[
            {                
                "role": "user",
                "content": f"Based on this prompt: '{prompt}`', what is the base URL I should go to? Just return the URL and absolutely nothing else. No preamble, no postamble.",
            },
        ],
        model="meta-llama/Llama-2-70b-chat-hf",
        max_tokens=100,
    )

    url = response.choices[0].message.content

    return url

def refine_prompt(prompt: str):
    return prompt
