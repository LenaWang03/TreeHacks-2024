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

  function drawBorder(element) {
    const rect = element.getBoundingClientRect();
    const borderWidth = 3; // The border width
    const borderOffset = borderWidth / 2;
    ctx.strokeStyle = "#0057FF"; // The border color
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(
      rect.left + borderOffset,
      rect.top + borderOffset,
      rect.width - borderWidth,
      rect.height - borderWidth
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

    function clearHoleForElement(element, index) {
      if (element) {
        const rect = element.getBoundingClientRect();
        ctx.clearRect(rect.left, rect.top, rect.width, rect.height);
        if (index === Math.floor(tags.length / 2)) {
          const tooltipHTML = `
            <div id="gazeTooltip" class="gaze-tooltip">
              <div class="gaze-tooltip-triangle"></div>
              <div class="gaze-tooltip-step">Step 2</div>
              <div class="gaze-tooltip-text">Type in your grandson's name</div>
              <div class="gaze-tooltip-close">&times;</div>
            </div>
            `;

          // The CSS for the tooltip
          const tooltipCSS = `
            .gaze-tooltip {
              width: 346px;
              height: 191px;
              border-radius: 15px;
              background: #FFD400;
              border: 5px solid #FFD400;
              position: absolute;
              padding: 10px;
              box-sizing: border-box;
              font-family: 'Inter', sans-serif;
              z-index: 10000;
            }

            .gaze-tooltip-step {
              font-size: 14px;
              font-weight: 700;
              line-height: 17px;
              color: #0057FF;
              padding: 5px 10px;
              border-radius: 10px;
              display: inline-block;
              margin-bottom: 5px;
            }

            .gaze-tooltip-text {
              font-size: 25px;
              font-weight: 700;
              line-height: 30px;
              background: #FFD400;
              color: black;
              padding: 5px 0;
              text-align: left;
            }

            .gaze-tooltip-close {
              font-size: 30px;
              line-height: 30px;
              color: blue;
              position: absolute;
              top: 10px;
              right: 10px;
              cursor: pointer;
            }

            .gaze-tooltip-triangle {
              position: absolute;
              top: -20px;
              left: 20%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 20px solid transparent; /* Adjust size to match the tooltip design */
              border-right: 20px solid transparent; /* Adjust size to match the tooltip design */
              border-bottom: 20px solid #FFD400; /* The color should match the tooltip's background */
            }
            `;

          function injectStyles(styles) {
            const styleSheet = document.createElement("style");
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
          }

          injectStyles(tooltipCSS);
          document.body.insertAdjacentHTML("beforeend", tooltipHTML);
          const tooltipElement = document.getElementById("gazeTooltip");
          tooltipElement.style.zIndex = "100001";
          tooltipElement.style.top = `${rect.bottom + window.scrollY + 20}px`;
          tooltipElement.style.left = `${rect.left + window.scrollX}px`;

          function closeTooltip() {
            tooltipElement.remove();
          }

          document
            .querySelector(".gaze-tooltip-close")
            .addEventListener("click", closeTooltip);
        }
        elementRects.push([rect, element]);
      }
    }

    // Locate the first anchor tag and get its position and dimensions
    tags.forEach((tag, index) => {
      const element = document.querySelector(`[gaze-id="${tag}"]`);
      clearHoleForElement(element, index);
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

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const tags = ["gaze-14", "gaze-19", "gaze-25"];
const urlParams = new URLSearchParams(window.location.search);
const isEnabled = urlParams.get("gazeEnabled");

if (isEnabled === "true") {
  (async () => {
    await sleep(2000);
    chrome.runtime.sendMessage({ action: "captureTab" }, (response) => {
      console.log("Screenshot taken");
    });
    sendHTML();
    addOverlay(tags);
  })();
}
