from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()

TOGETHER_API_KEY = os.environ.get("TOGETHER_API_KEY")
OPEN_AI_API_KEY = os.environ.get("OPEN_AI_API_KEY")

def load_together_client():
    client = OpenAI(
        api_key=TOGETHER_API_KEY,
        base_url="https://api.together.xyz",
    )
    return client

def load_openai_client():
    client = OpenAI(api_key=OPEN_AI_API_KEY)

    return client