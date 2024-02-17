from bs4 import BeautifulSoup

# Function to extract relevant attributes of a tag
def extract_attributes(tag):
    attributes = {
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

def process_html(html_content):
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

            if attributes["text"] or attributes["aria_label"]:
                tag_details.append(attributes)

    return tag_details
