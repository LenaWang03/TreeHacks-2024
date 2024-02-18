const API_URL = "http://localhost:8000";

// Initial setup for session storage (remains unchanged)
sessionStorage.setItem("highlightedElementIds", JSON.stringify([]));
sessionStorage.setItem("completedSteps", JSON.stringify([]));
sessionStorage.setItem("currentStep", JSON.stringify(""));
sessionStorage.setItem("taskDone", JSON.stringify(false));
sessionStorage.setItem(
  "generateNextStepParams",
  JSON.stringify({
    previous_steps: [],
    prompt: "I want to book a flight.",
    html: "",
  })
);

// Modified sendHTML function
function sendHTML() {
  return new Promise((resolve, reject) => {
    const elements = document.querySelectorAll("a, input, button, textarea");
    elements.forEach((element, index) => {
      element.setAttribute("gaze-id", `gaze-${index + 1}`);
    });

    const serializedHtml = new XMLSerializer().serializeToString(document);
    let generateNextStepParams = JSON.parse(
      sessionStorage.getItem("generateNextStepParams") || "{}"
    );
    generateNextStepParams["html"] = serializedHtml;
    sessionStorage.setItem(
      "generateNextStepParams",
      JSON.stringify(generateNextStepParams)
    );

    const url = `${API_URL}/generate-next-step`;
    console.log({ generateNextStepParams });

    resolve();

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(generateNextStepParams),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if (
          JSON.stringify(data["directions"]) !==
            sessionStorage.getItem("currentStep") ||
          JSON.stringify(data["task_complete"]) !==
            sessionStorage.getItem("taskDone")
        ) {
          sessionStorage.setItem(
            "currentStep",
            JSON.stringify(data["directions"])
          );
          sessionStorage.setItem(
            "taskDone",
            JSON.stringify(data["task_complete"])
          );
          sessionStorage.setItem(
            "generateNextStepParams",
            JSON.stringify(data["relevant_tag_ids"])
          );
          resolve(); // Only resolve when session storage is updated with new data
        } else {
          reject("No update required"); // Reject promise if no changes are necessary
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        reject(error);
      });
  });
}

// Utility to manage event listeners to avoid duplication
const elementEventListeners = {};

// Function to clear event listeners to prevent duplication
function clearEventListeners() {
  Object.entries(elementEventListeners).forEach(
    ([key, { element, event, listener }]) => {
      element.removeEventListener(event, listener);
      delete elementEventListeners[key]; // Remove the reference after removing the listener
    }
  );
}

// Function to add an event listener and keep track of it to avoid duplication
function addEventListenerWithKey(element, event, listener, key) {
  if (elementEventListeners[key]) {
    // If the listener already exists, first remove it
    const {
      element: storedElement,
      event: storedEvent,
      listener: storedListener,
    } = elementEventListeners[key];
    storedElement.removeEventListener(storedEvent, storedListener);
  }
  element.addEventListener(event, listener);
  elementEventListeners[key] = { element, event, listener }; // Store the new listener
}

// Adjustments to addOverlay function (mainly event listener handling)
function addOverlay() {
  clearEventListeners(); // Clear previous event listeners to prevent duplication

  const tags = ["gaze-3", "gaze-10", "gaze-20", "gaze-30"];
  const taskDone = JSON.parse(sessionStorage.getItem("taskDone") || "false");

  if (taskDone) {
    // Implement task completion logic here
    return;
  }

  if (!tags.length) return;

  // Create the canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size to cover the whole viewport
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "100000"; // Ensure it's on top

  // Function to check if a point is inside the rectangle (the hole)
  function isPointInHole(x, y, rect) {
    return (
      x > rect.left &&
      x < rect.left + rect.width &&
      y > rect.top &&
      y < rect.top + rect.height
    );
  }

  let elementRects = [];

  // Draw the overlay and the hole
  function drawOverlay(tags) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elementRects = [];

    // Draw the semi-transparent black overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)"; // 75% opacity black
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    function clearHoleForElement(element) {
      if (element) {
        const rect = element.getBoundingClientRect();
        ctx.clearRect(rect.left, rect.top, rect.width, rect.height);
        elementRects.push([rect, element]);
      }
    }

    // Locate the first anchor tag and get its position and dimensions
    tags.forEach((tag) => {
      const element = document.querySelector(`[gaze-id="${tag}"]`);
      if (!element) {
        console.warn(`Element with gaze-id="${tag}" not found.`);
        return;
      }

      const tagType = element.tagName;
      const event = tagType === "BUTTON" || tagType === "A" ? "click" : "input"; // Corrected to handle input elements properly
      const key = `event-${tag}`;

      const onInteraction = (e) => {
        // Interaction logic remains unchanged
      };

      addEventListenerWithKey(element, event, onInteraction, key);

      // Add a yellow 3px border to the element and clear a hole for it in the overlay
      element.style.border = "3px solid yellow";

      clearHoleForElement(element);
    });
  }

  drawOverlay(tags);

  // Add the canvas to the body
  document.body.appendChild(canvas);

  // Adjust the overlay when the user scrolls or resizes the window
  const adjustOverlay = () => {
    canvas.width = window.innerWidth;
    f;
    canvas.height = window.innerHeight;
    drawOverlay(tags); // Redraw the overlay and hole
  };

  window.addEventListener("resize", adjustOverlay);
  window.addEventListener("scroll", adjustOverlay);

  // Mouse move event to change cursor style
  canvas.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const isOverHole = elementRects.some((arr) => isPointInHole(x, y, arr[0]));
    canvas.style.cursor = isOverHole ? "pointer" : "default";
  });

  // Click event to trigger click on underlying element
  canvas.addEventListener("click", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    elementRects.forEach((arr) => {
      if (isPointInHole(x, y, arr[0])) {
        arr[1].click();
      }
    });
  });
}

const updateOverlay = async () => {
  await sendHTML(); // Wait for sendHTML to complete
  addOverlay(); // Then call addOverlay
};

const urlParams = new URLSearchParams(window.location.search);
const isEnabled = urlParams.get("gazeEnabled");

if (isEnabled !== "false") {
  console.log("updating overlay...");
  updateOverlay();
}
