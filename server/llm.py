from dotenv import dotenv_values
from openai import OpenAI
from soup import process_html

env_vars = dotenv_values(".env")

TOGETHER_API_KEY = env_vars["TOGETHER_API_KEY"]

client = OpenAI(api_key=TOGETHER_API_KEY,
  base_url="https://api.together.xyz",
)

# Placeholder
with open("./gmail.html", "r", encoding="utf-8") as f:
    html_content = f.read()
    tag_details = str(process_html(html_content))

# Take in the directions for the next step (a list of steps, returned by Dylan's code),
# the JSON object of relevant tags, and the textual representation of the screenshot
# Pending addition of ids to HTML tags
next_step = "Click the \"Compose\" button to start writing an email."
prompt = "Here is the description for the next step: \n" + next_step + \
        "\nHere is the JSON representation of the relevant HTML tags on the page: \n" + tag_details + \
        ".\n Using this information, which tags from the JSON are relevant to the next step? Just return the ids of the relevant tags in a list."

chat_completion = client.chat.completions.create(
  messages=[
    {
      "role": "user",
      "content": prompt,
    }
  ],
  model="mistralai/Mixtral-8x7B-Instruct-v0.1",
  max_tokens=100
)

relevant_tag_ids = chat_completion.choices[0].message.content
relevant_tag_ids = relevant_tag_ids.strip('][').split(', ')