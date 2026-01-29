// ================= CONFIG =================
const PRAYER_CONFIG = [
  { key: "Fajr",    label: "FAJR",    urdu: "فجر",   gap: 30 },
  { key: "Dhuhr",   label: "ZUHR",    urdu: "ظہر",   gap: 15 },
  { key: "Asr",     label: "ASR",     urdu: "عصر",   gap: 10 },
  { key: "Maghrib", label: "MAGHRIB", urdu: "مغرب", gap: 5  },
  { key: "Isha",    label: "ISHA",    urdu: "عشاء", gap: 10 }
];

let prayers = {};
let todayData = null;

// ================= TIME HELPERS =================
function timeToTodayDate(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
}

function addMinutesDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function subtractMinutesDate(date, minutes) {
  return new Date(date.getTime() - minutes * 60000);
}

// Format time to 12-hour with leading zero
function formatTime(date, showMeridian = false) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const meridian = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // 0 → 12
  const hh = hours < 10 ? "0" + hours : hours;
  const mm = minutes < 10 ? "0" + minutes : minutes;

  return showMeridian ? `${hh}:${mm} ${meridian}` : `${hh}:${mm}`;
}

// ================= FETCH TIMETABLE =================
fetch("./data/timetable.json")
  .then(res => {
    if (!res.ok) throw new Error("Timetable JSON load failed");
    return res.json();
  })
  .then(data => {
    const tableBody = document.getElementById("prayerTable");
    tableBody.innerHTML = "";

    const today = new Date();
    const month = today.toLocaleString("en-US", { month: "long" });
    const day = today.getDate().toString();

    if (!data[month] || !data[month][day]) {
      showError(tableBody, "Aaj ka timetable available nahi hai");
      return;
    }

    todayData = data[month][day];

    // ===== Build Prayer Schedule =====
    prayers = {};
    PRAYER_CONFIG.forEach(p => {
      if (!todayData[p.key]) return;
      const azan = timeToTodayDate(todayData[p.key]);
      prayers[p.label] = {
        label: p.label,
        azan,
        jamat: addMinutesDate(azan, p.gap),
        urdu: p.urdu
      };
    });

    // ===== Render Prayer Table =====
    Object.values(prayers).forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="prayer-name">${p.label}</td>
        <td class="azan-time">${formatTime(p.azan)}</td>
        <td class="jamat-time">${formatTime(p.jamat)}</td>
        <td class="urdu-name">${p.urdu}</td>
      `;
      tableBody.appendChild(row);
    });

    // ===== Sun Info =====
    document.getElementById("sunriseTime").textContent = formatTime(timeToTodayDate(todayData.Sunrise));
    document.getElementById("sunsetTime").textContent = formatTime(timeToTodayDate(todayData.Maghrib));
    document.getElementById("zuhrTime").textContent = formatTime(timeToTodayDate(todayData.Dhuhr));

    // Init features
    initZawal();
    initSunCarousel();
    initNextPrayer();
  })
  .catch(err => {
    console.error(err);
    showError(document.getElementById("prayerTable"), "Prayer timetable load nahi hua");
  });

function initZawal() {
  const sunrise = timeToTodayDate(todayData.Sunrise);
  const sunset  = timeToTodayDate(todayData.Maghrib);

  // Makrooh intervals
  const makroohMorningEnd = addMinutesDate(sunrise, 20);   // Subah ka Makrooh: sunrise + 20 min
  const makroohEveningStart = subtractMinutesDate(sunset, 20); // Sham ka Makrooh: sunset - 20 min

  // Display actual Zawal time (Zuhr start / Zohar starts)
  const zawalTimeEl = document.getElementById("zawalTime");
  if (zawalTimeEl && todayData["Zohar starts"]) {
    const zawalTime = timeToTodayDate(todayData["Zohar starts"]);
    zawalTimeEl.textContent = formatTime(zawalTime);
  }

  // Makrooh warning
  function updateMakrooh() {
    const now = new Date();
    const warningEl = document.getElementById("zawalWarning"); // HTML me ek span for warning
    if (!warningEl) return;

    if (now >= sunrise && now <= makroohMorningEnd) {
      // Morning Makrooh
      warningEl.textContent = "صُبح کے 20 منٹ تک نماز پڑھنا مکروہ ہے";
      warningEl.classList.remove("green");
      warningEl.classList.add("red");
    } else if (now >= makroohEveningStart && now <= sunset) {
      // Evening Makrooh
      warningEl.textContent = "شام کے 20 منٹ تک نماز پڑھنا مکروہ ہے";
      warningEl.classList.remove("green");
      warningEl.classList.add("red");
    } else {
      // Makrooh khatam
      warningEl.textContent = "مکروہ وقت ختم ہو چکا ہے";
      warningEl.classList.remove("red");
      warningEl.classList.add("green");
    }
  }

  // Run initially + update every minute
  updateMakrooh();
  setInterval(updateMakrooh, 60000);
}

// ================= SUN INFO CAROUSEL =================
function initSunCarousel() {
  const items = document.querySelectorAll("#sunInfoCarousel .sun-info-item");
  let index = 0;

  function rotate() {
    items.forEach(i => i.classList.remove("active"));
    items[index].classList.add("active");
    index = (index + 1) % items.length;
  }

  rotate();
  setInterval(rotate, 4000);
}

// ================= NEXT PRAYER + COUNTDOWN =================
function initNextPrayer() {
  function updateNextPrayer() {
    const now = new Date();
    let next = null;

    for (let p of Object.values(prayers)) {
      if (now < p.azan) {
        next = p;
        break;
      }
    }

    // Agar saari prayers guzar chuki hain → next day Fajr
    if (!next) {
      next = prayers["FAJR"];
      next = {
        ...next,
        azan: addMinutesDate(next.azan, 24 * 60)
      };
    }

    const diff = next.azan - now;
    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

    document.getElementById("next-prayer-name").textContent = next.label;
    document.getElementById("countdown").textContent = `${h}:${m}:${s}`;
  }

  updateNextPrayer();
  setInterval(updateNextPrayer, 1000);
}

// ================= UI ERROR =================
function showError(container, message) {
  container.innerHTML = `
    <tr>
      <td colspan="4" style="text-align:center;color:red;">
        ${message}
      </td>
    </tr>
  `;
}
