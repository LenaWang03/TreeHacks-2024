from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from pydantic import BaseModel
from sympy import together
from models import (
    GenerateNextStepRequest,
    GenerateNextStepResponse,
    RedirectRequest,
    RedirectResponse,
)
from server.llm import (
    get_next_step,
    get_page_description,
    get_relevant_tag_ids,
    load_openai_model,
    load_together_model,
)
from soup import process_html
import uvicorn

app = FastAPI()


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
    and returns the website to visit and a refined prompt.
    """

    response = {"url": "www.facebook.com", "prompt": request}
    return response


@app.post("/generate-next-step/", response_model=GenerateNextStepResponse)
async def generate_next_step(request: GenerateNextStepRequest = Body(...)):
    """
    Receives a screenshot and details about the user's current state on the webpage and
    returns directions for the next step they should take and the related DOM elements.
    task_complete returns True if the task has been completed
    """
    openai_client = load_openai_model()
    together_client = load_together_model()

    # Concurrently: process and filter HTML elements with beautiful soup into JSON with important information
    elements = process_html(request.html)

    # Use OpenAI (vision) to generate overall description of the user's page and UI components
    page_description = get_page_description(openai_client, request.image_url)

    # Use together.ai (?) LLM with created prompt to generate: (1) directions for next step, (2) the components that are related to that direction
    next_step = get_next_step(together_client, request.prompt, page_description)
    relevant_tag_ids = get_relevant_tag_ids(together_client, elements)

    return {
        "directions": next_step,
        "relevant_tag_ids": relevant_tag_ids,
        "task_complete": False,
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
