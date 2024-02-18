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

def process_html(html_content) -> str:
    # Parse the HTML content with BeautifulSoup
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

if __name__ == "__main__":
    file_path = os.path.join("server", "example_data", "gmail", "gmail.html")
    
    with open(file_path, "r", encoding="utf-8") as file:
        html_content = file.read()
    
    print(process_html(html_content)) 
    
