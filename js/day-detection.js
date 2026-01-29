// day-detection.js
// This script detects the current date and day of the week.
// It formats the date in a readable form (e.g., "January 25, 2026").
// It updates the corresponding DOM elements.
// It makes the currentDate and currentDay available globally for other scripts.
// Updates every minute to handle potential date changes.

// Global variables for availability to other scripts
let currentDate;
let currentDay;

// Function to update date and day
function updateDateAndDay() {
  currentDate = new Date();
  
  // Get DOM elements
  const dateDisplay = document.getElementById('current-date');
  const dayDisplay = document.getElementById('current-day');
  
  // Format date in readable form: "January 25, 2026"
  const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions);
  
  // Get day of the week: "Sunday"
  const dayOptions = { weekday: 'long' };
  currentDay = currentDate.toLocaleDateString('en-US', dayOptions);
  
  // Update DOM if elements exist
  if (dateDisplay) {
    dateDisplay.textContent = formattedDate;
  }
  if (dayDisplay) {
    dayDisplay.textContent = currentDay;
  }
}

// Initial call to set date and day immediately
updateDateAndDay();

// Update every minute (60000 ms) to handle date changes at midnight
setInterval(updateDateAndDay, 60000);

