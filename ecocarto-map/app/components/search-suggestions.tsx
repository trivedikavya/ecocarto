"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface SearchSuggestionsProps {
  query: string
  onSelect: (location: { lat: number; lng: number; name: string }) => void
  onClose: () => void
}

export default function SearchSuggestions({ query, onSelect, onClose }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        )
        const results = await response.json()
        setSuggestions(results || [])
      } catch (error) {
        console.error("Failed to fetch suggestions:", error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  if (!query.trim() || query.length < 3) return null

  return (
    <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
      {loading && (
        <div className="p-3 text-center text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mx-auto"></div>
        </div>
      )}

      {!loading && suggestions.length === 0 && (
        <div className="p-3 text-center text-sm text-gray-500">No results found</div>
      )}

      {!loading &&
        suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start p-3 h-auto text-left"
            onClick={() => {
              onSelect({
                lat: Number.parseFloat(suggestion.lat),
                lng: Number.parseFloat(suggestion.lon),
                name: suggestion.display_name,
              })
              onClose()
            }}
          >
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <div className="truncate">
              <div className="font-medium text-sm">{suggestion.display_name.split(",")[0]}</div>
              <div className="text-xs text-gray-500 truncate">{suggestion.display_name}</div>
            </div>
          </Button>
        ))}
    </div>
  )
}
