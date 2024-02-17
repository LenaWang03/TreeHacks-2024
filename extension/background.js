chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureTab") {
    setTimeout(() => {
      chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
        // Handle the captured image here
        console.log(dataUrl);
        sendResponse({ status: "Screenshot taken" });
      });
      return true;
    }, 2000); // Indicates you wish to send a response asynchronously
  }
});
