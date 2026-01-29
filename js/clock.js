// clock.js
// Real-time digital clock in 12-hour format
// AM/PM displayed in smaller size using span for styling
// Updates every second

function updateClock() {
    const clockDisplay = document.getElementById('digital-clock');
    if (!clockDisplay) return;

    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Determine AM / PM
    const meridian = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour time to 12-hour format
    hours = hours % 12 || 12;

    // Add leading zeros
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    // Update clock with styled spans
    clockDisplay.innerHTML = `
        <span class="time">${hh}:${mm}:${ss}</span>
        <span class="meridian">${meridian}</span>
    `;
}

// Initial call
updateClock();

// Update every second
setInterval(updateClock, 1000);
