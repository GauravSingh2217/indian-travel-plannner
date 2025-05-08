"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader, Clock, Car, Train, Plane, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TravelTimesProps {
  destinations: string[]
  transportationMode?: "DRIVING" | "WALKING" | "BICYCLING" | "TRANSIT"
}

interface RouteSegment {
  origin: string
  destination: string
  distance: string
  duration: string
  durationValue: number // in seconds
}

export default function TravelTimes({ destinations, transportationMode = "DRIVING" }: TravelTimesProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([])
  const [totalDuration, setTotalDuration] = useState<string>("")
  const [totalDistance, setTotalDistance] = useState<string>("")

  useEffect(() => {
    const fetchTravelTimes = async () => {
      if (destinations.length < 2) {
        setRouteSegments([])
        setTotalDuration("")
        setTotalDistance("")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const segments: RouteSegment[] = []
        let totalDurationSeconds = 0
        let totalDistanceMeters = 0

        // For each consecutive pair of destinations
        for (let i = 0; i < destinations.length - 1; i++) {
          const origin = destinations[i]
          const destination = destinations[i + 1]

          const response = await fetch("/api/maps/directions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              origin,
              destination,
              travelMode: transportationMode,
            }),
          })

          if (!response.ok) {
            throw new Error(`Failed to get directions between ${origin} and ${destination}`)
          }

          const data = await response.json()

          if (data.status !== "OK" || !data.routes || data.routes.length === 0) {
            throw new Error(`No route found between ${origin} and ${destination}`)
          }

          const route = data.routes[0]
          const leg = route.legs[0]

          const segment: RouteSegment = {
            origin,
            destination,
            distance: leg.distance.text,
            duration: leg.duration.text,
            durationValue: leg.duration.value,
          }

          segments.push(segment)
          totalDurationSeconds += leg.duration.value
          totalDistanceMeters += leg.distance.value
        }

        setRouteSegments(segments)

        // Format total duration
        const hours = Math.floor(totalDurationSeconds / 3600)
        const minutes = Math.floor((totalDurationSeconds % 3600) / 60)
        setTotalDuration(hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`)

        // Format total distance
        const kilometers = totalDistanceMeters / 1000
        setTotalDistance(`${kilometers.toFixed(1)} km`)

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching travel times:", error)
        setError("Failed to calculate travel times. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchTravelTimes()
  }, [destinations, transportationMode])

  const getModeIcon = () => {
    switch (transportationMode) {
      case "DRIVING":
        return <Car className="h-4 w-4" />
      case "TRANSIT":
        return <Train className="h-4 w-4" />
      case "BICYCLING":
        return <Plane className="h-4 w-4" />
      default:
        return <Car className="h-4 w-4" />
    }
  }

  if (destinations.length < 2) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Travel Times
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="h-6 w-6 animate-spin mr-2" />
            <span>Calculating travel times...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Travel Time</p>
                <p className="text-xl font-semibold">{totalDuration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Distance</p>
                <p className="text-xl font-semibold">{totalDistance}</p>
              </div>
              <Badge variant="outline" className="flex items-center">
                {getModeIcon()}
                <span className="ml-1">{transportationMode.charAt(0) + transportationMode.slice(1).toLowerCase()}</span>
              </Badge>
            </div>

            <div className="space-y-3 mt-4">
              {routeSegments.map((segment, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {segment.origin.split(",")[0]} to {segment.destination.split(",")[0]}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {segment.distance} • {segment.duration}
                      </p>
                    </div>
                    <Badge variant="secondary">{index + 1}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
