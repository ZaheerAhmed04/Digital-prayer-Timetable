// ================= REAL-TIME TEMPERATURE =================
const tempBox = document.getElementById('temperature');

if (!tempBox) {
  console.error("Temperature element not found");
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      fetch(`/weather?lat=${lat}&lon=${lon}`)
        .then(res => res.json())
        .then(data => {
          if (!data.main) {
            tempBox.textContent = "--°C";
            return;
          }
          tempBox.textContent = Math.round(data.main.temp) + "°C";
        })
        .catch(err => {
          console.error("Weather error:", err);
          tempBox.textContent = "--°C";
        });
    },
    error => {
      console.error("Location denied:", error);
      tempBox.textContent = "--°C";
    }
  );
} else {
  tempBox.textContent = "--°C";
}
