"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Leaf, Wind, Droplets, Thermometer } from "lucide-react"
import type { EnvironmentalData } from "../types/environmental"

interface EcoScoreCardProps {
  data: EnvironmentalData
}

export default function EcoScoreCard({ data }: EcoScoreCardProps) {
  const getScoreColor = (score: string) => {
    switch (score) {
      case "green":
        return "bg-green-500"
      case "yellow":
        return "bg-yellow-500"
      case "red":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getScoreText = (score: string) => {
    switch (score) {
      case "green":
        return "Excellent"
      case "yellow":
        return "Moderate"
      case "red":
        return "Poor"
      default:
        return "Unknown"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Leaf className="w-5 h-5 text-green-600" />
          <span>Eco Score</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-full ${getScoreColor(data.ecoScore)} mx-auto flex items-center justify-center mb-2`}
          >
            <span className="text-white font-bold text-lg">
              {data.ecoScore === "green" ? "A" : data.ecoScore === "yellow" ? "B" : "C"}
            </span>
          </div>
          <Badge variant={data.ecoScore === "green" ? "default" : "secondary"}>{getScoreText(data.ecoScore)}</Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Air Quality</span>
            </div>
            <span className="text-sm font-medium">{data.aqi.toFixed(0)} AQI</span>
          </div>
          <Progress value={Math.min(100, (data.aqi / 300) * 100)} className="h-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="w-4 h-4 text-green-500" />
              <span className="text-sm">Vegetation</span>
            </div>
            <span className="text-sm font-medium">{(data.ndvi * 100).toFixed(0)}%</span>
          </div>
          <Progress value={data.ndvi * 100} className="h-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-orange-500" />
              <span className="text-sm">Temperature</span>
            </div>
            <span className="text-sm font-medium">{data.temperature}°C</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Humidity</span>
            </div>
            <span className="text-sm font-medium">{data.humidity}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
