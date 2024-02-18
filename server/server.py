import uvicorn
from fastapi import Body, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from get_url import get_url, refine_prompt
from llm import (get_next_step, get_page_description, get_relevant_tag_ids,
                 load_openai_model, load_together_model)
from models import (GenerateNextStepRequest, GenerateNextStepResponse,
                    RedirectRequest, RedirectResponse)
from pydantic import BaseModel
from soup import process_html
from sympy import together
from utils import Timer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/")
async def health_check():
    """
    Health check route to ensure the server is running and responsive.
    """

    return {"message": "Server running!"}


@app.post("/redirect", response_model=RedirectResponse)
async def redirect(request: RedirectRequest):
    """
    Receives a natural language description of what the user wants to do on a website,
    and returns the website to visit and a refined prompt. If the user clicks the buttons,
    simply return the response. Otherwise, get the URL and refine the prompt.
    """
    if request.url is None:
        url = get_url(request.prompt)
        response = {"url": url, "prompt": RedirectRequest(request.prompt, url)}
    return response


@app.post("/generate-next-step/", response_model=GenerateNextStepResponse)
async def generate_next_step(request: GenerateNextStepRequest = Body(...)):
    """
    Receives a screenshot and details about the user's current state on the webpage and
    returns directions for the next step they should take and the related DOM elements.
    task_complete returns True if the task has been completed.
    """
    openai_client = load_openai_model()
    together_client = load_together_model()

    # Concurrently: process and filter HTML elements with beautiful soup into JSON with important information
    with Timer() as t:
        elements = process_html(request.html)
    print(f"Processing HTML: {t.interval} seconds")

    # Use OpenAI (vision) to generate overall description of the user's page and UI components
    with Timer() as t:
        # page_description = get_page_description(openai_client, request.image_url)
        page_description = "You are on the Google home page. There is a searchbar in the middle of the screen and two buttons below it."
    print(f"Getting page description: {t.interval} seconds")

    # Use together.ai (?) LLM with created prompt to generate: (1) directions for next step, (2) the components that are related to that direction
    with Timer() as t:
        next_step = get_next_step(together_client, request.prompt, page_description)
    print(f"Getting next step: {t.interval} seconds")

    with Timer() as t:
        relevant_tag_ids = get_relevant_tag_ids(together_client, elements)
    print(f"Getting relevant tag IDs: {t.interval} seconds")
    
    return {
        "directions": next_step,
        "relevant_tag_ids": relevant_tag_ids,
        "task_complete": False,
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
