"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Search, MapPin, Leaf, Wind, TrendingUp } from "lucide-react"
import LeafletMap from "./components/leaflet-map"
import EcoScoreCard from "./components/eco-score-card"
import HistoricalChart from "./components/historical-chart"
import PlantationSuggestions from "./components/plantation-suggestions"
import { fetchEnvironmentalData, calculateEcoScore } from "./utils/environmental-data"
import type { EnvironmentalData, EcoZone } from "./types/environmental"
import SearchSuggestions from "./components/search-suggestions"

export default function EcoCartoMap() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null)
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null)
  const [ecoZones, setEcoZones] = useState<EcoZone[]>([])
  const [selectedYear, setSelectedYear] = useState([2024])
  const [loading, setLoading] = useState(false)
  const [showHistorical, setShowHistorical] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      // Use free Nominatim geocoding service instead of Google
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
      )
      const results = await response.json()

      if (results && results.length > 0) {
        const result = results[0]
        const newLocation = {
          lat: Number.parseFloat(result.lat),
          lng: Number.parseFloat(result.lon),
          name: result.display_name,
        }

        setSelectedLocation(newLocation)

        // Fetch environmental data for the location
        const envData = await fetchEnvironmentalData(newLocation.lat, newLocation.lng)
        setEnvironmentalData(envData)

        // Generate eco zones around the location
        generateEcoZones(newLocation.lat, newLocation.lng, envData)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateEcoZones = (lat: number, lng: number, data: EnvironmentalData) => {
    const zones: EcoZone[] = []
    const gridSize = 0.01 // Approximately 1km

    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const zoneLat = lat + i * gridSize
        const zoneLng = lng + j * gridSize

        // Simulate varying environmental conditions
        const aqi = data.aqi + (Math.random() - 0.5) * 40
        const ndvi = data.ndvi + (Math.random() - 0.5) * 0.3

        const ecoScore = calculateEcoScore(Math.max(0, aqi), Math.max(0, Math.min(1, ndvi)))

        zones.push({
          id: `zone_${i}_${j}`,
          lat: zoneLat,
          lng: zoneLng,
          aqi: Math.max(0, aqi),
          ndvi: Math.max(0, Math.min(1, ndvi)),
          ecoScore,
          bounds: {
            north: zoneLat + gridSize / 2,
            south: zoneLat - gridSize / 2,
            east: zoneLng + gridSize / 2,
            west: zoneLng - gridSize / 2,
          },
        })
      }
    }

    setEcoZones(zones)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EcoCarto</h1>
                <p className="text-sm text-gray-600">Environmental Health Map</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Leaf className="w-3 h-3 mr-1" />
                Green Zones
              </Badge>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                <Wind className="w-3 h-3 mr-1" />
                Moderate Zones
              </Badge>
              <Badge variant="outline" className="text-red-600 border-red-600">
                <MapPin className="w-3 h-3 mr-1" />
                High Risk Zones
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search and Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Location Search</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter city or address..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowSuggestions(true)
                      }}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setShowSuggestions(true)}
                      className="flex-1"
                    />
                    <Button onClick={handleSearch} disabled={loading}>
                      {loading ? "..." : <Search className="w-4 h-4" />}
                    </Button>
                  </div>
                  {showSuggestions && (
                    <SearchSuggestions
                      query={searchQuery}
                      onSelect={(location) => {
                        setSelectedLocation(location)
                        setSearchQuery(location.name.split(",")[0])
                        setShowSuggestions(false)
                        fetchEnvironmentalData(location.lat, location.lng).then(setEnvironmentalData)
                        generateEcoZones(
                          location.lat,
                          location.lng,
                          environmentalData || {
                            aqi: 50,
                            ndvi: 0.5,
                            temperature: 25,
                            humidity: 60,
                            ecoScore: "yellow" as const,
                            timestamp: new Date().toISOString(),
                          },
                        )
                      }}
                      onClose={() => setShowSuggestions(false)}
                    />
                  )}
                </div>
                {selectedLocation && (
                  <div className="text-sm text-gray-600">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {selectedLocation.name}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historical Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Historical View</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year: {selectedYear[0]}</label>
                  <Slider
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                    min={2015}
                    max={2024}
                    step={1}
                    className="w-full"
                  />
                </div>
                <Button variant="outline" onClick={() => setShowHistorical(!showHistorical)} className="w-full">
                  {showHistorical ? "Hide" : "Show"} Historical Data
                </Button>
              </CardContent>
            </Card>

            {/* Eco Score */}
            {environmentalData && <EcoScoreCard data={environmentalData} />}

            {/* Plantation Suggestions */}
            {ecoZones.length > 0 && <PlantationSuggestions zones={ecoZones} />}
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <LeafletMap
                  center={selectedLocation || { lat: 40.7128, lng: -74.006, name: "New York" }}
                  ecoZones={ecoZones}
                  onLocationSelect={(location) => {
                    setSelectedLocation(location)
                    fetchEnvironmentalData(location.lat, location.lng).then(setEnvironmentalData)
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Historical Chart */}
        {showHistorical && selectedLocation && (
          <div className="mt-6">
            <HistoricalChart location={selectedLocation} selectedYear={selectedYear[0]} />
          </div>
        )}
      </div>
    </div>
  )
}
