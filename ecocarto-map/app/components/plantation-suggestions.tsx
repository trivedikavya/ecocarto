"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TreePine, Download, MapPin, AlertTriangle } from "lucide-react"
import type { EcoZone } from "../types/environmental"

interface PlantationSuggestionsProps {
  zones: EcoZone[]
}

export default function PlantationSuggestions({ zones }: PlantationSuggestionsProps) {
  const criticalZones = zones.filter((zone) => zone.ecoScore === "red")
  const moderateZones = zones.filter((zone) => zone.ecoScore === "yellow")

  const generateReport = () => {
    const reportData = {
      criticalZones: criticalZones.length,
      moderateZones: moderateZones.length,
      recommendations: [
        "Plant native trees in red zones to improve air quality",
        "Increase green cover in moderate zones",
        "Monitor pollution levels regularly",
        "Implement urban forestry programs",
      ],
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "plantation-report.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TreePine className="w-5 h-5 text-green-600" />
          <span>Plantation Suggestions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {criticalZones.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-800">Critical Areas</span>
              <Badge variant="destructive">{criticalZones.length}</Badge>
            </div>
            <p className="text-sm text-red-700">Immediate tree plantation needed in high pollution areas</p>
          </div>
        )}

        {moderateZones.length > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Moderate Areas</span>
              <Badge variant="secondary">{moderateZones.length}</Badge>
            </div>
            <p className="text-sm text-yellow-700">Enhance green cover to prevent degradation</p>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Recommended Actions:</h4>
          <ul className="text-xs space-y-1 text-gray-600">
            <li>• Plant native species for better adaptation</li>
            <li>• Focus on air-purifying trees (e.g., Neem, Peepal)</li>
            <li>• Create green corridors between zones</li>
            <li>• Implement community gardening programs</li>
          </ul>
        </div>

        <Button onClick={generateReport} variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </CardContent>
    </Card>
  )
}
