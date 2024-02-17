chrome.runtime.sendMessage({ action: "captureTab" }, (response) => {
  console.log("Screenshot taken");
});

const tags = ["gaze-10", "gaze-14", "gaze-19"];

function sendHTML() {
  // Select all relevant elements
  const elements = document.querySelectorAll("a, input, button, textarea");

  // Assign a unique "gaze-id" to each element
  elements.forEach((element, index) => {
    element.setAttribute("gaze-id", `gaze-${index + 1}`);
  });

  const serializedHtml = new XMLSerializer().serializeToString(document);
  console.log(serializedHtml);
  // const url = 'YOUR_BACKEND_ENDPOINT'; // Replace with your actual backend endpoint

  //   fetch(url, {
  //       method: 'POST',
  //       headers: {
  //           'Content-Type': 'application/json',
  //       },.
  //       body: JSON.stringify({ html: serializedHtml }),
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //       console.log('Success:', data);
  //   })
  //   .catch((error) => {
  //       console.error('Error:', error);
  //   });
}

function addOverlay(tags) {
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

  const elementRects = [];

  // Draw the overlay and the hole
  function drawOverlay(tags) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      clearHoleForElement(element);
    });
  }

  drawOverlay(tags);

  // Add the canvas to the body
  document.body.appendChild(canvas);

  // Adjust the overlay when the user scrolls or resizes the window
  const adjustOverlay = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawOverlay(tags); // Redraw the overlay and hole
  };

  window.addEventListener("resize", adjustOverlay);
  window.addEventListener("scroll", adjustOverlay);

  // Listen for mouse movement to change the cursor style when hovering over the hole

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

sendHTML();
addOverlay(tags);
