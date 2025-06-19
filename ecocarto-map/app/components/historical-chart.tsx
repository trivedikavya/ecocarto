"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Calendar } from "lucide-react"

interface HistoricalChartProps {
  location: { lat: number; lng: number; name: string }
  selectedYear: number
}

export default function HistoricalChart({ location, selectedYear }: HistoricalChartProps) {
  // Generate historical data (in real app, this would come from APIs)
  const generateHistoricalData = () => {
    const data = []
    for (let year = 2015; year <= 2024; year++) {
      // Simulate improving environmental conditions over time
      const baseAqi = 80 + Math.random() * 40
      const aqiTrend = (2024 - year) * 2 // Slight improvement over time
      const aqi = Math.max(20, baseAqi + aqiTrend + (Math.random() - 0.5) * 20)

      const baseNdvi = 0.4 + Math.random() * 0.3
      const ndviTrend = (year - 2015) * 0.01 // Slight improvement over time
      const ndvi = Math.min(0.9, Math.max(0.1, baseNdvi + ndviTrend))

      data.push({
        year,
        aqi: Math.round(aqi),
        ndvi: Math.round(ndvi * 100),
        vegetation: Math.round(ndvi * 100),
        pollution: Math.round(aqi),
      })
    }
    return data
  }

  const historicalData = generateHistoricalData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Historical Environmental Trends</span>
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">{location.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            aqi: {
              label: "Air Quality Index",
              color: "hsl(var(--chart-1))",
            },
            vegetation: {
              label: "Vegetation Cover (%)",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="pollution"
                stroke="var(--color-aqi)"
                name="Air Quality Index"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="vegetation"
                stroke="var(--color-vegetation)"
                name="Vegetation Cover (%)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-700">Current Year ({selectedYear})</div>
            <div className="text-blue-600">
              {historicalData.find((d) => d.year === selectedYear)?.pollution || "N/A"} AQI
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-700">Vegetation Trend</div>
            <div className="text-green-600">
              {historicalData.find((d) => d.year === selectedYear)?.vegetation || "N/A"}% Cover
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
