from typing import List, Optional

from pydantic import BaseModel, Field, HttpUrl


class DOMElement(BaseModel):
  id: str
  tag_type: str
  input_type: Optional[str] = None
  inner_text: Optional[str] = None
  aria_label: Optional[str] = None
  href: Optional[str] = None
  
class LLMGetIdsResponse(BaseModel):
  ids: List[str] = Field(description="ids of the elements that are related to the next step")

class RedirectRequest(BaseModel):
  prompt: str # the task the user requests
  url: Optional[str] # the url for the requested action if already known

class RedirectResponse(BaseModel):
  url: HttpUrl  # URL that user should visit to complete their task
  prompt: str  # The user's prompt

class GenerateNextStepRequest(BaseModel):
  previous_steps: List[str] # the steps the user has taken so far
  prompt: str # the prompt of the task the user wants to complete
  html: str #  HTML from the page at the current state

class GenerateNextStepResponse(BaseModel):
  directions: str  # The next step the user should take to complete their task
  relevant_tag_ids: List[str]  # List of ids related to the next step and their properties
  task_complete: bool  # True when the user has completed all steps for their task

class UnclearException(BaseModel):
  detail: str  # Detailed message about the unclear requested action

class GeneralException(BaseModel):
  detail: str  # Detailed message about the error