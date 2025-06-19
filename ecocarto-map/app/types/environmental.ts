export interface EnvironmentalData {
  aqi: number
  ndvi: number
  temperature: number
  humidity: number
  ecoScore: "green" | "yellow" | "red"
  timestamp: string
}

export interface EcoZone {
  id: string
  lat: number
  lng: number
  aqi: number
  ndvi: number
  ecoScore: "green" | "yellow" | "red"
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
}

export interface Location {
  lat: number
  lng: number
  name: string
}
