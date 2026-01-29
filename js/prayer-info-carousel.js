// =================== TIME HELPERS ===================

function convertTo12Hour(timeStr) {
  if (!timeStr) return "--:--";
  let [h, m] = timeStr.split(":").map(Number);
  const meridian = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${meridian}`;
}

function addMinutes(timeStr, mins) {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m + mins, 0, 0);
  return d.toTimeString().slice(0, 5);
}

function subtractMinutes(timeStr, mins) {
  return addMinutes(timeStr, -mins);
}

// =================== CAROUSEL ===================

const prayerItems = document.querySelectorAll('.prayer-info-item');
let prayerIndex = 0;

function rotatePrayerInfo() {
  prayerItems.forEach(i => i.classList.remove('active'));
  prayerItems[prayerIndex].classList.add('active');
  prayerIndex = (prayerIndex + 1) % prayerItems.length;
}

rotatePrayerInfo();
setInterval(rotatePrayerInfo, 3000);

// =================== GLOBAL STORAGE ===================

let sunriseTime = null;
let zawalTimeAPI = null;

// =================== FETCH TODAY TIMETABLE ===================

const today = new Date();
const month = today.toLocaleString('en-US', { month: 'long' });
const day = today.getDate();

fetch('data/timetable.json')
  .then(res => res.json())
  .then(data => {
    const t = data[month]?.[day];
    if (!t) return;

    sunriseTime = t.Sunrise;

    document.getElementById('tahajjudTime').textContent = convertTo12Hour(t.Fajr);
    document.getElementById('tuluTime').textContent     = convertTo12Hour(t.Sunrise);
    document.getElementById('gurubTime').textContent    = convertTo12Hour(t.Maghrib);
    document.getElementById('sehriTime').textContent    = convertTo12Hour(t.Fajr);
    document.getElementById('iftarTime').textContent    = convertTo12Hour(t.Maghrib);

    document.getElementById('temperature').textContent =
      t.Temperature ? t.Temperature + "°C" : "--°C";

    calculateIshraqChasht(); // try calculation
  });

// =================== FETCH REAL-TIME ZAWAL (API) ===================

const city = "Rajouri";
const country = "India";
const method = 2;

fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`)
  .then(res => res.json())
  .then(data => {
    zawalTimeAPI = data.data.timings.Dhuhr; // solar noon reference
    document.getElementById('zawalTime').textContent =
      convertTo12Hour(zawalTimeAPI);

    calculateIshraqChasht(); // try calculation
  });

// =================== CALCULATE ISHRAQ & CHASHT ===================

function calculateIshraqChasht() {
  if (!sunriseTime || !zawalTimeAPI) return;

  // FIQH-BASED RULES
  const ishraqStart = addMinutes(sunriseTime, 20);
  const chashtStart = ishraqStart;
  const chashtEnd   = subtractMinutes(zawalTimeAPI, 5);

  document.getElementById('ishraqTime').textContent =
    convertTo12Hour(ishraqStart);

  document.getElementById('chashtTime').textContent =
    `${convertTo12Hour(chashtStart)} – ${convertTo12Hour(chashtEnd)}`;
}

// =================== HIJRI DATE ===================

const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();

fetch(`https://api.aladhan.com/v1/gToH?date=${dd}-${mm}-${yyyy}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById('hijriDate').textContent =
      data.data.hijri.date;
    document.getElementById('arabicMonth').textContent =
      data.data.hijri.month.ar;
  });
