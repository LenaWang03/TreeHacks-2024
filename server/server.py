import uvicorn
from fastapi import Body, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from get_url import get_url
from models import (GenerateNextStepRequest, GenerateNextStepResponse,
                    RedirectRequest, RedirectResponse)
from next_step import get_next_step, get_relevant_tag_ids
from soup import get_tag_details
from task_complete import is_complete

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
    Receives details about the user's current state on the webpage and returns 
    directions for the next step they should take and the related DOM elements.
    task_complete returns True if the task has been completed.
    """
    # LLM call to determine if task is complete. It is complete if the prompt can be answered by looking on the current page (HTML)
    task_complete = is_complete(request.prompt, request.html)

    if task_complete:
        return {
            "directions": None,
            "relevant_tag_ids": None,
            "task_complete": True,
        }

    # get_next_step uses no knowledge of the HTML of the page and just returns the logical next step
    next_step = get_next_step(request.previous_steps, request.prompt)
    # get_relevant_tag_ids finds the relevant tag ids based on the generated next step and the HTML of the page
    tag_details = get_tag_details(request.html)
    relevant_tag_ids = get_relevant_tag_ids(next_step, tag_details)
    
    return {
        "directions": next_step,
        "relevant_tag_ids": relevant_tag_ids,
        "task_complete": False,
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
