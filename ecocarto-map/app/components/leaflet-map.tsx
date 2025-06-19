"use client"

import { useEffect, useRef, useState } from "react"
import type { EcoZone } from "../types/environmental"

interface LeafletMapProps {
  center: { lat: number; lng: number; name: string }
  ecoZones: EcoZone[]
  onLocationSelect: (location: { lat: number; lng: number; name: string }) => void
}

export default function LeafletMap({ center, ecoZones, onLocationSelect }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const overlaysRef = useRef<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [leaflet, setLeaflet] = useState<any>(null)

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      try {
        // Dynamically import Leaflet
        const L = await import("leaflet")

        // Import CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        // Fix default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        setLeaflet(L)
        setIsLoaded(true)
      } catch (error) {
        console.error("Failed to load Leaflet:", error)
      }
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (!isLoaded || !leaflet || !mapRef.current) return

    // Initialize map
    const map = leaflet.map(mapRef.current).setView([center.lat, center.lng], 12)

    // Add OpenStreetMap tiles
    leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      })
      .addTo(map)

    mapInstanceRef.current = map

    // Add click listener
    map.on("click", async (e: any) => {
      const { lat, lng } = e.latlng

      try {
        // Reverse geocoding using Nominatim
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        const result = await response.json()

        onLocationSelect({
          lat,
          lng,
          name: result.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        })
      } catch (error) {
        console.error("Reverse geocoding failed:", error)
        onLocationSelect({
          lat,
          lng,
          name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        })
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isLoaded, leaflet, center, onLocationSelect])

  useEffect(() => {
    if (!mapInstanceRef.current || !leaflet || !ecoZones.length) return

    // Clear existing overlays
    overlaysRef.current.forEach((overlay) => {
      mapInstanceRef.current.removeLayer(overlay)
    })
    overlaysRef.current = []

    // Add eco zone overlays
    ecoZones.forEach((zone) => {
      const color = getZoneColor(zone.ecoScore)

      const rectangle = leaflet.rectangle(
        [
          [zone.bounds.south, zone.bounds.west],
          [zone.bounds.north, zone.bounds.east],
        ],
        {
          fillColor: color,
          fillOpacity: 0.4,
          color: color,
          weight: 1,
        },
      )

      rectangle.addTo(mapInstanceRef.current)

      // Add popup
      rectangle.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">Environmental Data</h3>
          <p class="text-xs">AQI: ${zone.aqi.toFixed(1)}</p>
          <p class="text-xs">NDVI: ${zone.ndvi.toFixed(2)}</p>
          <p class="text-xs">Status: <span class="font-medium">${zone.ecoScore}</span></p>
        </div>
      `)

      overlaysRef.current.push(rectangle)
    })
  }, [ecoZones, leaflet])

  // Update map center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng], 12)
    }
  }, [center])

  const getZoneColor = (ecoScore: string): string => {
    switch (ecoScore) {
      case "green":
        return "#22c55e"
      case "yellow":
        return "#eab308"
      case "red":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full rounded-lg" />
}
