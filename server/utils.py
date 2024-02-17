from PIL import Image
import requests
from io import BytesIO
import base64
import time
import binascii

class Timer:
    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, *args):
        self.end = time.time()
        self.interval = self.end - self.start
        
def scale_image(encoded_data: str, scale_factor: float) -> str:
    # Remove the prefix of the data URL if present
    if encoded_data.startswith('data:image/png;base64,'):
        encoded_data = encoded_data.replace('data:image/png;base64,', '')
    
    # Decode the base64 encoded image data
    image_data = base64.b64decode(encoded_data)
    
    # Open the image
    image = Image.open(BytesIO(image_data))

    # Calculate the new size
    new_size = (int(image.width * scale_factor), int(image.height * scale_factor))

    # Resize the image
    resized_image = image.resize(new_size, Image.Resampling.LANCZOS)

    # Convert the resized image back into base64 encoded string
    buffered = BytesIO()
    resized_image.save(buffered, format="PNG")
    new_encoded_data = base64.b64encode(buffered.getvalue()).decode()

    # Return the resized image as a base64 encoded string
    return 'data:image/png;base64,' + new_encoded_data