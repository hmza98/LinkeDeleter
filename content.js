function addButtonToListItems() {
  const listItems = document.querySelectorAll(
    "ul.reusable-search__entity-result-list li.reusable-search__result-container"
  );

  listItems.forEach((item) => {
    // Check if the button already exists to prevent duplication
    if (item.querySelector(".custom-alert-button")) return;

    // Find the anchor tag within the list item
    const link = item.querySelector("a.app-aware-link.scale-down");
    const url = link ? link.href : null;

    // Find the div with class 'entity-result__actions entity-result__divider'
    const actionsDiv = item.querySelector(
      ".entity-result__actions.entity-result__divider"
    );

    if (actionsDiv) {
      // Find child elements with aria-label starting with "Message"
      const messageButton = Array.from(
        actionsDiv.querySelectorAll("[aria-label]")
      ).find((el) => el.getAttribute("aria-label").startsWith("Message"));

      if (messageButton && url) {
        // Create the button
        const button = document.createElement("button");
        button.textContent = "Remove";
        button.className = "custom-alert-button";

        // Apply custom styles to the button
        button.style.marginLeft = "10px"; // Add some spacing
        button.style.border = "2px solid red"; // Red border
        button.style.borderRadius = "5px"; // Rounded corners
        button.style.padding = "5px 10px"; // Add padding for better appearance
        button.style.backgroundColor = "white"; // Background color to make border stand out
        button.style.color = "red"; // Text color to match the border
        button.style.cursor = "pointer"; // Change cursor to pointer on hover

        // Apply hover effect styles
        button.addEventListener("mouseover", () => {
          button.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"; // Subtle shadow
          button.style.borderWidth = "3px"; // Increase border thickness
        });

        button.addEventListener("mouseout", () => {
          button.style.boxShadow = "none"; // Remove shadow
          button.style.borderWidth = "2px"; // Reset border thickness
        });

        // Insert the button right after the message button
        messageButton.parentNode.insertBefore(
          button,
          messageButton.nextSibling
        );

        // Add a click event to the button
        button.addEventListener("click", () => {
          // Send a message to the background script to open the tab and run the script
          chrome.runtime.sendMessage({ action: "openTab", url: url });
        });
      }
    }
  });
}

// Run the function after the content is fully loaded
window.addEventListener("load", addButtonToListItems);

// Optionally, observe DOM changes to add buttons to newly loaded content
const observer = new MutationObserver(addButtonToListItems);
observer.observe(document.body, { childList: true, subtree: true });
