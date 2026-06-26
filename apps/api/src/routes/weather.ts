import { Router, Request, Response } from "express";

const router = Router();
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

function generateMockWeather() {
  const conditions = ["Clear", "Clouds", "Rain"];
  const descriptions = ["Sunny and dry", "Partly cloudy", "Heavy rain showers"];
  
  return {
    list: Array.from({ length: 40 }).map((_, i) => ({
      dt: Math.floor(Date.now() / 1000) + i * 10800,
      main: {
        temp: 32 + Math.random() * 5,
        humidity: 60 + Math.random() * 20,
      },
      weather: [{
        main: conditions[i % 3],
        description: descriptions[i % 3],
        icon: i % 3 === 0 ? "01d" : i % 3 === 1 ? "03d" : "10d"
      }],
      wind: { speed: 10 + Math.random() * 15 }
    }))
  };
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const lat = (req.query.lat as string) || "28.6139";
    const lon = (req.query.lon as string) || "77.2090";

    if (!OPENWEATHER_API_KEY) {
      return res.json(generateMockWeather());
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
       return res.json(generateMockWeather());
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Weather API Error:", error);
    return res.json(generateMockWeather());
  }
});

export default router;
