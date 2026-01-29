# 🏗 System Architecture – Digital Prayer Timetable Clock

## 📌 Overview
The **Digital Prayer Timetable Clock** follows a **modular, client-side architecture** focused on **simplicity, performance, and reliability**.  
The system works entirely on the browser using **static assets** (HTML, CSS, JavaScript, JSON) and does **not depend on any external API**.

The architecture is designed in a way that allows **future backend and database integration** without rewriting the core logic.

---

## 🧩 System Architecture

### High-Level Architecture
┌──────────────────────────┐
│ index.html │
│ (UI & DOM Structure) │
└─────────────┬────────────┘
│
▼
┌──────────────────────────┐
│ main.js │
│ (Application Bootstrap) │
└───────┬─────────┬────────┘
│ │
▼ ▼
┌────────────┐ ┌────────────────┐
│ clock.js │ │ day-detection │
│ (Real-Time │ │ .js │
│ Clock) │ │ (Date & Day) │
└────────────┘ └────────────────┘
│
▼
┌──────────────────────────┐
│ prayer-logic.js │
│ (Timetable & Prayer │
│ Highlighting Logic) │
└─────────────┬────────────┘
│
▼
┌──────────────────────────┐
│ timetable.json │
│ (Static Yearly Data) │
└──────────────────────────┘

---

## 🔄 Data Flow

1. **Application Start**
   - Browser loads `index.html`
   - CSS and JS files are linked

2. **Initialization**
   - `main.js` initializes all modules
   - Clock, date detection, and prayer logic start

3. **Date & Time Detection**
   - `clock.js` updates digital time every second
   - `day-detection.js` determines current date and weekday

4. **Timetable Fetching**
   - `prayer-logic.js` loads `timetable.json`
   - Extracts current month and day
   - Fetches only today’s prayer times

5. **UI Update**
   - Prayer times injected into DOM
   - Current or upcoming prayer is highlighted dynamically

---

## 🧠 Component Responsibilities

### `index.html`
- Defines UI containers
- No logic
- Acts as the presentation shell

---

### `main.js`
- Application entry point
- Controls load order
- Calls and coordinates all modules

---

### `clock.js`
- Real-time digital clock
- Updates time every second
- Independent of prayer logic

---

### `day-detection.js`
- Detects current date and day
- Formats date for display
- Supplies data to other modules

---

### `prayer-logic.js`
- Loads prayer timetable data
- Determines current and next prayer
- Highlights prayer based on time
- Handles edge cases:
  - Before Fajr
  - After Isha

---

### `timetable.json`
- Stores full yearly prayer data
- Structured for scalability
- Acts as a lightweight database

---

## 🗄 Future Database Integration Plan

### Planned Backend Architecture


Frontend (HTML/CSS/JS)
│
▼
Backend (Node.js / PHP / Python)
│
▼
MySQL Database


### Migration Strategy
- Replace `timetable.json` fetch with API call
- Database tables:
  - `prayer_times`
  - `locations`
  - `special_days`
- Admin panel for editing prayer times
- Same frontend logic remains unchanged

---

## ⚡ Performance Considerations

- ✅ Static JSON loading (fast)
- ✅ No external API calls
- ✅ Minimal DOM updates
- ✅ Modular JS files
- ✅ Low memory usage
- ✅ Works on low-end devices
- ✅ Suitable for 24/7 display screens

---

## 🔐 Reliability & Stability

- Offline-first design
- Predictable timetable data
- No runtime dependency failures
- Graceful fallback handling

---

## 🚀 Scalability & Extensibility

- Multi-location support
- Multi-language support
- Notification system
- Screen rotation support
- Mobile & TV display modes

---

## 🧾 Conclusion
This architecture ensures:
- **Clean separation of concerns**
- **High reliability**
- **Ease of maintenance**
- **Future-proof expansion**

The system is suitable for **Masjid prayer clocks, institutions, and community centers** requiring a dependable digital prayer timetable solution.
