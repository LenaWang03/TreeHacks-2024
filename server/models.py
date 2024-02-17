from pydantic import BaseModel, HttpUrl
from typing import Optional, List

class DOMElement(BaseModel):
  id: str
  tag_type: str
  input_type: Optional[str] = None
  inner_text: Optional[str] = None
  aria_label: Optional[str] = None
  href: Optional[str] = None

class RedirectRequest(BaseModel):
  prompt: str # requested action by the user
  url: Optional[str] # the url for the requested action if already known

class RedirectResponse(BaseModel):
  url: HttpUrl  # URL that user should visit to complete their desired action
  prompt: str  # The refined prompt for the user

class GenerateNextStepRequest(BaseModel):
  previous_steps: List[str] # the steps the user has taken so far
  prompt: str # the refined prompt of the desired action by the user
  html: str #  html from the page at the current state

class GenerateNextStepResponse(BaseModel):
  directions: str  # The next step the user should take to achieve their desired action
  related_elements: List[DOMElement]  # List of DOM elements related to the next step and their properties
  task_complete: bool  # True when the user has completed all steps for their desired action

class UnclearException(BaseModel):
  detail: str  # Detailed message about the unclear requested action

class GeneralException(BaseModel):
  detail: str  # Detailed message about the error