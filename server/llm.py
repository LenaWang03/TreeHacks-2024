import json
import os

from load_ai_clients import load_openai_client, load_together_client
from models import LLMGetIdsResponse
from soup import process_html
from utils import Timer, scale_image


def get_page_description(encoded_url: str) -> str:
    client = load_openai_client()
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


def get_page_description_from_url(url: str) -> str:
    client = load_openai_client()
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"I'm at this url: {url}. Describe the elements I'm seeing. Write it in list format.",
            },
        ],
        model="meta-llama/Llama-2-70b-chat-hf",
        max_tokens=1024,
    )

    return chat_completion.choices[0].message.content


def get_next_step(desired_action: str, tag_details_string: str) -> str:
    client = load_together_client()
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
    relevant HTML tags' details: {tag_details_string}
    [/INST]
    """

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ],
        model="meta-llama/Llama-2-70b-chat-hf",
        max_tokens=1024,
    )

    return chat_completion.choices[0].message.content


def get_relevant_tag_ids(tags: str) -> str:
    client = load_openai_client()
    # Pending addition of ids to HTML tags
    next_step = 'Click the "Compose" button to start writing an email.'
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


if __name__ == "__main__":
    together_client = load_together_client()
    openai_client = load_openai_client()

    # img_encoded_path = r"server\example_data\encoded_img.txt"

    # with open(img_encoded_path, "r", encoding="utf-8") as file:
    #     # Read the entire content of the file into a string
    #     file_content = file.read()

    # with Timer() as t:
    #     description = get_page_description(openai_client, file_content)
    # print(f"description: {t.interval}")
    file_path = os.path.join("server", "example_data", "gmail", "gmail.html")
    
    with open(file_path, "r", encoding="utf-8") as file:
        html_content = file.read()
    tag_details_string = process_html(html_content)

    with Timer() as t:
        next_step = get_next_step(
            together_client,
            tag_details_string,
        )
    print(f"next step: {t.interval}")

    print(f"returns: {next_step}")

    # Placeholder
    with open("./gmail.html", "r", encoding="utf-8") as f:
        html_content = f.read()
        tags = str(process_html(html_content))
