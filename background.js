chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openTab" && request.url) {
    // Open the new tab
    chrome.tabs.create({ url: request.url, active: false }, (tab) => {
      // Inject the script into the newly opened tab

      chrome.scripting.executeScript({
        target: { tabId: tab.id },

        func: () => {
          // Function to check and click the "Remove Connection" item
          function clickRemoveConnection() {
            // Select the dropdown container
            const dropdownContainer = document.querySelector(
              ".artdeco-dropdown__content-inner"
            );

            if (dropdownContainer) {
              // Inside the dropdown container, find the <ul> element
              const ulElement = dropdownContainer.querySelector("ul");

              if (ulElement) {
                // Find the <li> element containing the "Remove Connection" option
                const removeConnectionItem = Array.from(
                  ulElement.querySelectorAll("li")
                ).find((li) => {
                  const buttonDiv = li.querySelector(
                    'div[aria-label^="Remove your connection"]'
                  );
                  return (
                    buttonDiv &&
                    buttonDiv.textContent.includes("Remove Connection")
                  );
                });

                if (removeConnectionItem) {
                  // Find the <div> inside the <li>
                  const buttonDiv = removeConnectionItem.querySelector(
                    'div[aria-label^="Remove your connection"]'
                  );

                  if (buttonDiv) {
                    // Click the <div> element
                    buttonDiv.click();
                    console.log("Remove Connection item clicked.");
                    return true; // Stop further checks as we have found and clicked the item
                  } else {
                    console.log("Button <div> not found inside the <li>.");
                  }
                } else {
                  console.log("Remove Connection item not found.");
                }
              } else {
                console.log("<ul> element not found inside the dropdown.");
              }
            } else {
              console.log("Dropdown container not found.");
            }
            return false; // Element not found or action not performed
          }

          // Function to wait for elements to be available
          function waitForElements(interval = 1000, maxAttempts = 30) {
            let attempts = 0;
            const retryInterval = setInterval(() => {
              attempts++;
              if (clickRemoveConnection() || attempts >= maxAttempts) {
                clearInterval(retryInterval); // Stop retrying after max attempts or success
              }
            }, interval);
          }

          // Run after window load to ensure the initial page is fully loaded
          window.addEventListener("load", () => {
            // Start the wait for elements
            waitForElements();
          });
        },
      });
    });
  }
});
