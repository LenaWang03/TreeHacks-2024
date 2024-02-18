function clearOverlay() {
  // Remove the canvas from the DOM
  const canvas = document.querySelector("canvas");
  if (canvas) {
    canvas.parentNode.removeChild(canvas);
  }

  // Remove the tooltip from the DOM
  const tooltip = document.getElementById("gazeTooltip");
  if (tooltip) {
    tooltip.parentNode.removeChild(tooltip);
  }
}

function addOverlay(tags, stepNumber, text) {
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
    ctx.strokeStyle = "#FFD400"; // The border color
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
              <div class="gaze-tooltip-step">Step ${stepNumber}</div>
              <div class="gaze-tooltip-text">${text}</div>
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
      const id = tag.split(" ").join(".");
      const element = document.querySelector("." + id);
      clearHoleForElement(element, index);
      drawBorder(element);
    });
  }

  //   // Draw the semi-transparent black overlay
  //   ctx.fillStyle = "rgba(0, 0, 0, 0.75)"; // 75% opacity black
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);

  //   function clearHoleForElement(element) {
  //     if (element) {
  //       const rect = element.getBoundingClientRect();
  //       ctx.clearRect(rect.left, rect.top, rect.width, rect.height);
  //       elementRects.push([rect, element]);
  //     }
  //   }

  //   // Locate the first anchor tag and get its position and dimensions
  //   tags.forEach((tag) => {
  //     const element = document.querySelector(`[gaze-id="${tag}"]`);
  //     clearHoleForElement(element);
  //   });
  // }

  // drawOverlay(tags);

  // // Add the canvas to the body
  // document.body.appendChild(canvas);

  // // Adjust the overlay when the user scrolls or resizes the window
  // const adjustOverlay = () => {
  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;
  //   drawOverlay(tags); // Redraw the overlay and hole
  // };

  // window.addEventListener("resize", adjustOverlay);
  // window.addEventListener("scroll", adjustOverlay);

  // Click event to trigger click on underlying element
  canvas.addEventListener("click", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    elementRects.forEach((arr) => {
      if (isPointInHole(x, y, arr[0])) {
        if (stepNumber === 1) {
          arr[1].click();
          clearOverlay();
          addOverlay(
            [
              "xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x9f619 xdt5ytf xh8yej3",
            ],
            2,
            "Type in your grandson's name and press Enter (↵)"
          );
        }
      }
    });
  });
}

const tags = [
  "x1a2a7pz x1qjc9v5 xnwf7zb x40j3uw x1s7lred x15gyhx8 x9f619 x78zum5 x1fns5xo x1n2onr6 xh8yej3 x1ba4aug xmjcpbm",
];
const urlParams = new URLSearchParams(window.location.search);
const isEnabled = urlParams.get("gazeEnabled");

if (isEnabled === "true") {
  addOverlay(tags, 1, "Click the search bar to get started!");
}
