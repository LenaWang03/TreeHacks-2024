import base64

from dotenv import dotenv_values
from openai import OpenAI

env_vars = dotenv_values(".env")

open_ai_api_key = env_vars["OPEN_AI_API_KEY"]

client = OpenAI(api_key=open_ai_api_key)

with open("image.png", "rb") as img_file:
    encoded_string = base64.b64encode(img_file.read()).decode('utf-8')
    encoded_string = f"data:image/png;base64,{encoded_string}"

response = client.chat.completions.create(
    model="gpt-4-vision-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "This is a screenshot of a webpage. Describe the elements you see in this screenshot. Write it in list format."},
                {
                    "type": "image_url",
                    # get image url from screenshot
                    "image_url": encoded_string,
                    # "image_url": "https://media.gcflearnfree.org/content/55e078dcbae0135431cfdd45_09_06_2014/getting_started_newsfeed_edit.jpg",
                },
            ],
        }
    ],
    max_tokens=1000,
)

print(response.choices[0].message.content)
