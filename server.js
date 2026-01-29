const express = require('express');
const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = "557e4886957ab29980dadee0f94f77e2";

  try {
    const url =
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    const response = await fetch(url); // ✅ built-in fetch
    const data = await response.json();

    console.log("Weather OK:", data.main.temp); // 🔍 debug
    res.json(data);

  } catch (err) {
    console.error("Weather ERROR:", err);
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
