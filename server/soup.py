import json
import os

from bs4 import BeautifulSoup


# Function to extract relevant attributes of a tag
def extract_attributes(tag):
    attributes = {
        "id": tag.get("gaze-id"),
        "type": tag.name,
        "text": tag.get_text(strip=True),
        "aria_label": tag.get("aria-label"),
    }
    # Add specific attribute checks here
    if tag.name == "a":
        attributes["href"] = tag.get("href")
    
    if tag.name == "input":
        attributes["input-type"] = tag.get("type")

    return attributes

def get_tag_details(html_content) -> str:
    soup = BeautifulSoup(html_content, "html.parser")

    # Initialize an empty list to hold the tag details
    tag_details = []
    
    # List of tag types to extract
    tag_types = ["a", "textarea", "input", "button"]

    # Iterate over each type and extract details
    for tag_type in tag_types:
        for tag in soup.find_all(tag_type):
            attributes = extract_attributes(tag)

            if attributes.get("text", None) or attributes.get("aria_label", None):
                tag_details.append(attributes)

    tag_details_string = json.dumps(tag_details)
    
    return tag_details_string
