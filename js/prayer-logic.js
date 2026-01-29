// prayer-logic.js
// This script handles loading the prayer timetable from timetable.json,
// displaying the prayer times for the current day, and highlighting the current prayer
// based on the current time. It updates every minute to handle time changes and day changes.

// Global variables
let data; // To store the loaded timetable.json
let lastDay = currentDay; // Track the last known day to detect changes

// Define the order of prayers (assuming standard five daily prayers)
const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// Function to display prayer times for the current day
function displayPrayers() {
  const timetable = data[currentDay];
  if (!timetable) {
    console.error('No timetable for the current day');
    return;
  }

  const prayerList = document.getElementById('prayer-times-list');
  prayerList.innerHTML = ''; // Clear existing list

  prayerOrder.forEach(name => {
    const time = timetable[name];
    if (time) {
      const li = document.createElement('li');
      li.innerHTML = `<span class="prayer-name">${name}</span> <span class="prayer-time">${time}</span>`;
      li.dataset.name = name;
      li.dataset.time = time;
      prayerList.appendChild(li);
    }
  });
}

// Function to highlight the current prayer
// Logic explanation:
// - Convert current time to minutes since midnight.
// - For each prayer, convert its time to minutes.
// - Find the prayer with the largest minutes <= currentMinutes (the most recent started prayer).
// - If none (before Fajr), highlight the first prayer (Fajr) as the next/upcoming.
// - If after Isha (but before midnight), the last prayer (Isha) will be selected since its time <= current.
// - After midnight (new day, before Fajr), no prayer <= current, so highlight Fajr.
// - This handles edge cases: before Fajr (highlight Fajr), after Isha (highlight Isha).
// - Removes 'current-prayer' class from all, adds to the selected one.
function highlightCurrent() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayerList = document.getElementById('prayer-times-list');
  const lis = prayerList.querySelectorAll('li');

  let currentLi = null;
  let maxMinutes = -1;

  lis.forEach(li => {
    const timeStr = li.dataset.time;
    const [h, m] = timeStr.split(':').map(Number);
    const minutes = h * 60 + m;

    if (minutes <= currentMinutes && minutes > maxMinutes) {
      maxMinutes = minutes;
      currentLi = li;
    }
  });

  if (!currentLi && lis.length > 0) {
    // Before first prayer (Fajr), highlight Fajr
    currentLi = lis[0];
  }

  // Remove highlight from all
  lis.forEach(li => li.classList.remove('current-prayer'));

  // Add highlight to current
  if (currentLi) {
    currentLi.classList.add('current-prayer');
  }
}

// Function to update the prayer display and highlight
// Called every minute to check for day changes and time progress
function updatePrayerDisplay() {
  if (currentDay !== lastDay) {
    displayPrayers();
    lastDay = currentDay;
  }
  highlightCurrent();
}

// Load the timetable.json and initialize
fetch('data/timetable.json')
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData;
    displayPrayers();
    highlightCurrent();
    // Set interval to update every minute (60000 ms)
    setInterval(updatePrayerDisplay, 60000);
  })
  .catch(error => {
    console.error('Error loading timetable.json:', error);
  });