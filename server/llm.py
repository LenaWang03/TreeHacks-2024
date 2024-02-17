from dotenv import load_dotenv
from openai import OpenAI
import os

from utils import Timer, scale_image

load_dotenv()

TOGETHER_API_KEY = os.environ.get("TOGETHER_API_KEY")
OPEN_AI_API_KEY = os.environ.get("OPEN_AI_API_KEY")

def load_together_model():
    client = OpenAI(
        api_key=TOGETHER_API_KEY,
        base_url="https://api.together.xyz",
    )
    return client


def load_openai_model():
    client = OpenAI(api_key=OPEN_AI_API_KEY)

    return client


def get_page_description(client: OpenAI, encoded_url: str) -> str:
    scaled_image_url = scale_image(encoded_url, 0.3)
    
    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "This is a screenshot of a webpage. Describe the elements you see in this screenshot. Write it in list format.",
                    },
                    {
                        "type": "image_url",
                        "image_url": scaled_image_url,
                    },
                ],
            }
        ],
        max_tokens=1000,
    )

    return response.choices[0].message.content

def get_page_description_from_url(client: OpenAI, url: str) -> str:
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"I'm at this url: {url}. Describe the elements I'm seeing. Write it in list format.",
            },
        ],
        model="mistralai/Mixtral-8x7B-Instruct-v0.1",
        max_tokens=1024,
    )

    return chat_completion.choices[0].message.content


def get_next_step(client: OpenAI, desired_action: str, page_description: str) -> str:
    prompt = f"""
    <s>[INST] You are a helpful code assistant who helps users navigate the web. Your task is to generate the next task the user should perform based on their desired action and a description of the page they're looking at. So for instance based on the following:
    desired action: I want to see the pictures of my friend Gordon Cheung.
    
    page description: "The image you've uploaded appears to be a screenshot from a Facebook page. Here are the elements visible in the screenshot:

    Navigation Bar: At the top, there is a search bar and navigation icons typically used for home, friend requests, messages, notifications, and profile access.

    User Profile: On the left side, there is a sidebar with a profile picture, which suggests that the user of the account is named "Dylan Lau". Below the profile, there are various menu options including Friends, Marketplace, Memories, Saved, Groups, Feeds, Events, and other shortcuts.

    Facebook Post: In the center, there is a Facebook post with a photo showing two individuals wearing soccer jerseys. The jerseys have a sponsor logo of "HSBC" on them. The photo appears to have elicited a significant number of reactions and comments, as indicated by the icons and numbers beneath it.

    Comments and Reactions: The post has gathered reactions from people (indicated by the heart and like emojis) and has comments, though the content of the comments is not visible in the screenshot.

    Right Sidebar: On the right, there are sections for "Your Pages and profiles," "Birthdays" showing friends with birthdays, and a "Contacts" section with a list of friends.

    Facebook Features: Throughout the interface, you can see typical Facebook features like the ability to like, comment, and share a post",
    
    You would return :[/INST]
    Search for Your Friend: Click on the search bar at the top left of the Facebook page.
    
    [INST] The next action should be specific, short and only capture one and only one user action. Don't provide any notes in your and only return one next action. [/INST]
    </s>
    [INST]
    desired action: {desired_action}
    page description: {page_description}
    [/INST]
    """

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ],
        model="mistralai/Mixtral-8x7B-Instruct-v0.1",
        max_tokens=1024,
    )

    return chat_completion.choices[0].message.content


if __name__ == "__main__":
    together_client = load_together_model()
    openai_client = load_openai_model()
    
    img_encoded_path = r"server\example_data\encoded_img.txt"
    
    with open(img_encoded_path, 'r', encoding='utf-8') as file:
        # Read the entire content of the file into a string
        file_content = file.read()
    
    with Timer() as t:
        description = get_page_description(openai_client, file_content)
    print(f"description: {t.interval}")
    
    # with Timer() as t:
    #     description = get_page_description_from_url(together_client, "https://stackoverflow.com")
    # print(f"description: {t.interval}")
    
    with Timer() as t:
        next_step = get_next_step(
            together_client,
            description,
            "I want to search for a post about using OpenAI's API.",
        )
    print(f"next step: {t.interval}")
        
    print(f"description: {description}")
    print(f"returns: {next_step}")