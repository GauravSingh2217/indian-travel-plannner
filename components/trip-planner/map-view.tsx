"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MapViewProps {
  destinations: string[]
  itinerary: any[]
  transportationMode?: "DRIVING" | "WALKING" | "BICYCLING" | "TRANSIT"
}

// Declare google variable
declare global {
  interface Window {
    google?: any
  }
}

export default function MapView({ destinations, itinerary, transportationMode = "DRIVING" }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null)

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      if (typeof window === "undefined") {
        return
      }

      if (window.google?.maps) {
        initializeMap()
        return
      }

      try {
        // Fetch API key from server
        const response = await fetch("/api/maps")
        if (!response.ok) {
          throw new Error("Failed to load Google Maps API key")
        }

        const data = await response.json()
        const apiKey = data.apiKey

        if (!apiKey) {
          setMapError("Google Maps API key is missing. Please check server configuration.")
          setIsLoading(false)
          return
        }

        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = initializeMap
        script.onerror = () => {
          setMapError("Failed to load Google Maps. Please check your API key and internet connection.")
          setIsLoading(false)
        }

        document.head.appendChild(script)
      } catch (error) {
        console.error("Error loading Google Maps:", error)
        setMapError("Failed to load Google Maps API key from server.")
        setIsLoading(false)
      }
    }

    loadGoogleMapsScript()

    return () => {
      // Clean up markers when component unmounts
      markers.forEach((marker) => marker.setMap(null))
      if (directionsRenderer) {
        directionsRenderer.setMap(null)
      }
    }
  }, [])

  // Initialize map when script is loaded
  const initializeMap = () => {
    if (!mapRef.current || !window.google?.maps) return

    try {
      // Create a new map instance
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 }, // Center of India
        zoom: 5,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      })

      setMap(newMap)

      // Create directions renderer
      const newDirectionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true, // We'll add our own markers
        polylineOptions: {
          strokeColor: "#3b82f6", // Blue line
          strokeWeight: 4,
          strokeOpacity: 0.7,
        },
      })

      newDirectionsRenderer.setMap(newMap)
      setDirectionsRenderer(newDirectionsRenderer)

      setIsLoading(false)

      // Add markers for destinations when map is ready
      if (destinations.length > 0) {
        addDestinationMarkers(newMap)
      }
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapError("Error initializing map. Please try again later.")
      setIsLoading(false)
    }
  }

  // Add markers when destinations change
  useEffect(() => {
    if (map && destinations.length > 0) {
      addDestinationMarkers(map)
    }
  }, [destinations, map])

  // Update route when transportation mode changes
  useEffect(() => {
    if (map && destinations.length > 1 && directionsRenderer) {
      drawRoute(map, destinations, transportationMode)
    }
  }, [transportationMode, destinations, map, directionsRenderer])

  // Function to add markers for destinations
  const addDestinationMarkers = async (mapInstance: google.maps.Map) => {
    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))
    const newMarkers: google.maps.Marker[] = []

    // Create bounds to fit all markers
    const bounds = new window.google.maps.LatLngBounds()

    // Process each destination
    for (let i = 0; i < destinations.length; i++) {
      const destination = destinations[i]
      try {
        // Get coordinates for the destination using our server API
        const response = await fetch(`/api/maps/geocode?address=${encodeURIComponent(destination)}`)

        if (!response.ok) {
          throw new Error(`Geocoding failed for ${destination}`)
        }

        const data = await response.json()

        if (data.status !== "OK" || !data.results || data.results.length === 0) {
          throw new Error(`No results found for ${destination}`)
        }

        const location = data.results[0].geometry.location

        // Create marker
        const marker = new window.google.maps.Marker({
          position: location,
          map: mapInstance,
          title: destination,
          animation: window.google.maps.Animation.DROP,
          label: {
            text: (i + 1).toString(),
            color: "white",
          },
        })

        // Add info window with destination name
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="font-weight: bold; padding: 5px;">${destination}</div>`,
        })

        marker.addListener("click", () => {
          infoWindow.open(mapInstance, marker)
        })

        newMarkers.push(marker)
        bounds.extend(location)
      } catch (error) {
        console.error(`Error adding marker for ${destination}:`, error)
      }
    }

    // Set markers state
    setMarkers(newMarkers)

    // Fit map to show all markers if there are any
    if (newMarkers.length > 0) {
      mapInstance.fitBounds(bounds)

      // If only one marker, zoom out a bit
      if (newMarkers.length === 1) {
        mapInstance.setZoom(12)
      }
    }

    // Draw route between destinations if there are multiple
    if (newMarkers.length > 1 && directionsRenderer) {
      drawRoute(mapInstance, destinations, transportationMode)
    }
  }

  // Function to draw route between destinations
  const drawRoute = async (mapInstance: google.maps.Map, places: string[], mode: string) => {
    if (places.length < 2 || !directionsRenderer) return

    try {
      // Use our server-side API to get directions
      const response = await fetch("/api/maps/directions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: places[0],
          destination: places[places.length - 1],
          waypoints: places.slice(1, -1).map((place) => ({ location: place })),
          travelMode: mode,
          optimize: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get directions")
      }

      const data = await response.json()

      if (data.status !== "OK") {
        throw new Error(`Directions request failed: ${data.status}`)
      }

      // Convert the response to a format that DirectionsRenderer can use
      const directionsResult = {
        routes: data.routes,
        request: {
          origin: places[0],
          destination: places[places.length - 1],
          travelMode: mode,
        },
      }

      directionsRenderer.setDirections(directionsResult)
    } catch (error) {
      console.error("Error drawing route:", error)
      // If directions fail, at least show the markers
      markers.forEach((marker) => marker.setMap(mapInstance))
    }
  }

  // Handle retry when map fails to load
  const handleRetry = async () => {
    setIsLoading(true)
    setMapError(null)

    // Remove existing script tag if any
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.remove()
    }

    try {
      // Fetch API key from server
      const response = await fetch("/api/maps")
      if (!response.ok) {
        throw new Error("Failed to load Google Maps API key")
      }

      const data = await response.json()
      const apiKey = data.apiKey

      if (!apiKey) {
        setMapError("Google Maps API key is missing. Please check server configuration.")
        setIsLoading(false)
        return
      }

      // Reload the map
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      script.onerror = () => {
        setMapError("Failed to load Google Maps. Please check your API key and internet connection.")
        setIsLoading(false)
      }

      document.head.appendChild(script)
    } catch (error) {
      console.error("Error loading Google Maps:", error)
      setMapError("Failed to load Google Maps API key from server.")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Trip Map</h3>

      <div ref={mapRef} className="w-full h-[400px] bg-muted rounded-md overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Loader className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4 max-w-md">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{mapError}</AlertDescription>
              </Alert>
              <Button className="mt-4" onClick={handleRetry}>
                Retry
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Interactive map showing your selected destinations and routes. Click on markers to see more information.</p>
      </div>
    </div>
  )
}
