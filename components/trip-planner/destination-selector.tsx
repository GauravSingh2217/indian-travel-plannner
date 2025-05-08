"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, MapPin } from "lucide-react"
import Image from "next/image"

// Update the popular destinations
const popularDestinations = [
  { id: 1, name: "Delhi, India", image: "/images/delhi.png" },
  { id: 2, name: "Mumbai, India", image: "/images/mumbai.png" },
  { id: 3, name: "Jaipur, India", image: "/images/jaipur.png" },
  { id: 4, name: "Goa, India", image: "/images/goa.png" },
  { id: 5, name: "Varanasi, India", image: "/images/varanasi.png" },
  { id: 6, name: "Agra, India", image: "/images/agra.png" },
]

// Update the search destinations function
const searchDestinations = (query: string) => {
  if (!query) return []

  const allDestinations = [
    ...popularDestinations,
    { id: 7, name: "Kolkata, India", image: "/images/kolkata.png" },
    { id: 8, name: "Chennai, India", image: "/images/chennai.png" },
    { id: 9, name: "Udaipur, India", image: "/images/udaipur.png" },
    { id: 10, name: "Darjeeling, India", image: "/images/darjeeling.png" },
    { id: 11, name: "Rishikesh, India", image: "/images/rishikesh.png" },
    { id: 12, name: "Amritsar, India", image: "/images/amritsar.png" },
  ]

  return allDestinations.filter((dest) => dest.name.toLowerCase().includes(query.toLowerCase()))
}

interface DestinationSelectorProps {
  selectedDestinations: string[]
  onChange: (destinations: string[]) => void
}

export default function DestinationSelector({ selectedDestinations, onChange }: DestinationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof popularDestinations>([])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setSearchResults(searchDestinations(query))
  }

  const addDestination = (destination: string) => {
    if (!selectedDestinations.includes(destination)) {
      onChange([...selectedDestinations, destination])
    }
    setSearchQuery("")
    setSearchResults([])
  }

  const removeDestination = (destination: string) => {
    onChange(selectedDestinations.filter((d) => d !== destination))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Where do you want to go?</h2>
        <div className="relative">
          <Input
            placeholder="Search for a city or country..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>

        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full max-w-md bg-background border rounded-md shadow-lg">
            <ul className="py-1">
              {searchResults.map((result) => (
                <li
                  key={result.id}
                  className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center"
                  onClick={() => addDestination(result.name)}
                >
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {result.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {selectedDestinations.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Your selected destinations:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedDestinations.map((destination) => (
              <Badge key={destination} variant="secondary" className="text-sm py-1 px-3">
                {destination}
                <button
                  onClick={() => removeDestination(destination)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium mb-3">Popular destinations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {popularDestinations.map((destination) => (
            <Card
              key={destination.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => addDestination(destination.name)}
            >
              <div className="relative h-32">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-3">
                <p className="font-medium">{destination.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
