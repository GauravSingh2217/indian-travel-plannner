"use client"

import { useEffect, useRef, useState } from "react"
import { Loader, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface DestinationMapProps {
  destination: string
  attractions?: Array<{
    name: string
    location: string
  }>
}

// Declare google as a global variable
declare global {
  interface Window {
    google?: any
    initMap?: () => void
  }
}

export default function DestinationMap({ destination, attractions = [] }: DestinationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      if (window.google?.maps) {
        initializeMap()
        return
      }

      try {
        // Check if API key is configured
        const response = await fetch("/api/maps")
        if (!response.ok) {
          throw new Error("Failed to check Google Maps API configuration")
        }

        const data = await response.json()
        if (!data.configured) {
          setMapError("Google Maps API key is not configured. Please check server configuration.")
          setIsLoading(false)
          return
        }

        // Define the callback function
        window.initMap = initializeMap

        // Load the Google Maps script with a callback
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&callback=initMap`
        script.async = true
        script.defer = true
        script.onerror = () => {
          setMapError("Failed to load Google Maps. Please check your internet connection.")
          setIsLoading(false)
        }

        document.head.appendChild(script)
      } catch (error) {
        console.error("Error loading Google Maps:", error)
        setMapError("Failed to load Google Maps API configuration from server.")
        setIsLoading(false)
      }
    }

    loadGoogleMapsScript()

    // Cleanup function
    return () => {
      if (window.initMap) {
        delete window.initMap
      }
    }
  }, [])

  // Initialize map when script is loaded
  const initializeMap = async () => {
    if (!mapRef.current || !window.google?.maps) return

    try {
      // Use our server API to geocode the destination
      const geocodeResponse = await fetch(`/api/maps/geocode?address=${encodeURIComponent(destination)}`)
      if (!geocodeResponse.ok) {
        throw new Error("Geocoding request failed")
      }

      const geocodeData = await geocodeResponse.json()
      if (geocodeData.status !== "OK" || !geocodeData.results || geocodeData.results.length === 0) {
        throw new Error(`Could not find location: ${destination}`)
      }

      const location = geocodeData.results[0].geometry.location

      // Create a new map instance centered on the destination
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      })

      setMap(newMap)

      // Add main destination marker
      const marker = new window.google.maps.Marker({
        position: location,
        map: newMap,
        title: destination,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
      })

      // Add info window for main destination
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="font-weight: bold; padding: 5px;">${destination}</div>`,
      })

      marker.addListener("click", () => {
        infoWindow.open(newMap, marker)
      })

      // Add attraction markers if provided
      if (attractions.length > 0) {
        addAttractionMarkers(newMap)
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapError("Error initializing map. Please try again later.")
      setIsLoading(false)
    }
  }

  // Add markers for attractions
  const addAttractionMarkers = async (mapInstance: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds()

    // Get the current center to include in bounds
    const center = mapInstance.getCenter()
    if (center) {
      bounds.extend(center)
    }

    // Add markers for each attraction
    for (let i = 0; i < attractions.length; i++) {
      const attraction = attractions[i]
      const fullLocation = `${attraction.location}, ${destination}`

      try {
        const geocodeResponse = await fetch(`/api/maps/geocode?address=${encodeURIComponent(fullLocation)}`)
        if (!geocodeResponse.ok) {
          continue
        }

        const geocodeData = await geocodeResponse.json()
        if (geocodeData.status !== "OK" || !geocodeData.results || geocodeData.results.length === 0) {
          continue
        }

        const location = geocodeData.results[0].geometry.location

        // Create marker with different color
        const marker = new window.google.maps.Marker({
          position: location,
          map: mapInstance,
          title: attraction.name,
          animation: window.google.maps.Animation.DROP,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new window.google.maps.Size(32, 32),
          },
        })

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="font-weight: bold; padding: 5px;">${attraction.name}</div>`,
        })

        marker.addListener("click", () => {
          infoWindow.open(mapInstance, marker)
        })

        // Extend bounds to include this location
        bounds.extend(location)

        // Fit bounds after adding the last marker
        if (i === attractions.length - 1) {
          mapInstance.fitBounds(bounds)

          // Don't zoom in too far
          const listener = window.google.maps.event.addListener(mapInstance, "idle", () => {
            if (mapInstance.getZoom()! > 16) {
              mapInstance.setZoom(16)
            }
            window.google.maps.event.removeListener(listener)
          })
        }
      } catch (error) {
        console.error(`Error adding marker for ${attraction.name}:`, error)
      }
    }
  }

  // Handle retry when map fails to load
  const handleRetry = () => {
    setIsLoading(true)
    setMapError(null)

    // Remove existing script tag if any
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.remove()
    }

    // Reload the map
    if (window.initMap) {
      delete window.initMap
    }

    window.initMap = initializeMap

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&callback=initMap`
    script.async = true
    script.defer = true
    script.onerror = () => {
      setMapError("Failed to load Google Maps. Please check your internet connection.")
      setIsLoading(false)
    }

    document.head.appendChild(script)
  }

  return (
    <div className="w-full h-[400px] bg-muted rounded-md overflow-hidden relative">
      <div ref={mapRef} className="w-full h-full"></div>

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
  )
}
