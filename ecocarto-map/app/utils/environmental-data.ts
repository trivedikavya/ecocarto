import type { EnvironmentalData } from "../types/environmental"

export async function fetchEnvironmentalData(lat: number, lng: number): Promise<EnvironmentalData> {
  try {
    // Fetch AQI data from AQICN API
    const aqiResponse = await fetch(
      `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${process.env.NEXT_PUBLIC_AQICN_API_TOKEN}`,
    )

    let aqi = 50 + Math.random() * 100 // Fallback random data
    let temperature = 20 + Math.random() * 15
    let humidity = 40 + Math.random() * 40

    if (aqiResponse.ok) {
      const aqiData = await aqiResponse.json()
      if (aqiData.status === "ok" && aqiData.data) {
        aqi = aqiData.data.aqi || aqi
        temperature = aqiData.data.iaqi?.t?.v || temperature
        humidity = aqiData.data.iaqi?.h?.v || humidity
      }
    }

    // Simulate NDVI data (in real app, this would come from Google Earth Engine)
    const ndvi = Math.max(0, Math.min(1, 0.3 + Math.random() * 0.5))

    const ecoScore = calculateEcoScore(aqi, ndvi)

    return {
      aqi,
      ndvi,
      temperature,
      humidity,
      ecoScore,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error fetching environmental data:", error)

    // Return simulated data as fallback
    const aqi = 50 + Math.random() * 100
    const ndvi = 0.3 + Math.random() * 0.5

    return {
      aqi,
      ndvi,
      temperature: 20 + Math.random() * 15,
      humidity: 40 + Math.random() * 40,
      ecoScore: calculateEcoScore(aqi, ndvi),
      timestamp: new Date().toISOString(),
    }
  }
}

export function calculateEcoScore(aqi: number, ndvi: number): "green" | "yellow" | "red" {
  if (aqi < 50 && ndvi > 0.5) return "green"
  if (aqi < 100 && ndvi > 0.3) return "yellow"
  return "red"
}
