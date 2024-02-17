from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from pydantic import BaseModel
from models import GenerateNextStepRequest, GenerateNextStepResponse, RedirectRequest, RedirectResponse
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
async def generate_next_step(file: UploadFile = File(...), body: GenerateNextStepRequest = Body(...)):
    """
    Receives a screenshot and details about the user's current state on the webpage and
    returns directions for the next step they should take and the related DOM elements.
    task_complete returns True if the task has been completed 
    """
    # Use OpenAI (vision) to generate overall description of the user's page and UI components

    # Concurrently: process and filter HTML elements with beautiful soup into JSON with important information
    
    # Create prompt that combines processed HTML JSON and description of user's page to ask for the next step based on their overall goal

    # Use together.ai (?) LLM with created prompt to generate: (1) directions for next step, (2) the components that are related to that direction

    return {"message": "Screenshot received and processed."}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
