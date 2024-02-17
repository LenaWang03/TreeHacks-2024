import base64

from dotenv import dotenv_values
from openai import OpenAI

env_vars = dotenv_values(".env")

OPEN_AI_API_KEY = env_vars["OPEN_AI_API_KEY"]

client = OpenAI(api_key=OPEN_AI_API_KEY)

with open(r"server\example_data\gmail\gmail.png", "rb") as img_file:
    encoded_string = base64.b64encode(img_file.read()).decode('utf-8')
    encoded_string = f"data:image/png;base64,{encoded_string}"

response = client.chat.completions.create(
    model="gpt-4-vision-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "This is a screenshot of a webpage. Describe the elements you see in this screenshot. Write it in list format. Make the response within 100 words."},
                {
                    "type": "image_url",
                    "image_url": encoded_string,
                },
            ],
        }
    ],
    max_tokens=100,
)

description = response.choices[0].message.content
