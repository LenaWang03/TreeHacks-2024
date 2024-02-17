from openai import OpenAI
import os

TOGETHER_API_KEY = os.environ.get("TOGETHER_API_KEY")


def load_together_model():
    client = OpenAI(
        api_key=TOGETHER_API_KEY,
        base_url="https://api.together.xyz",
    )
    return client


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
    Search for Your Friend: Use the search bar at the top of the Facebook page to type in "Gordon Cheung" and press enter. This should bring up a list of profiles matching that name.
    </s>
    [INST]
    desired action: {desired_action}
    page description: {page_description}
    [/INST]
    """
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are an AI assistant",
            },
            {
                "role": "user",
                "content": "Tell me about San Francisco",
            },
        ],
        model="mistralai/Mixtral-8x7B-Instruct-v0.1",
        max_tokens=1024,
    )

    return chat_completion.choices[0].message.content