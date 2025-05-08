"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Users, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

// Indian destinations for the dropdown
const indianDestinations = [
  "Delhi, India",
  "Mumbai, India",
  "Jaipur, India",
  "Agra, India",
  "Goa, India",
  "Varanasi, India",
  "Kolkata, India",
  "Chennai, India",
  "Udaipur, India",
  "Darjeeling, India",
  "Rishikesh, India",
  "Amritsar, India",
  "Kochi, India",
  "Shimla, India",
  "Manali, India",
]

export default function QuickPlannerForm() {
  const router = useRouter()
  const [destinations, setDestinations] = useState<{ id: number; name: string; duration: string }[]>([])
  const [currentDestination, setCurrentDestination] = useState("")
  const [currentDuration, setCurrentDuration] = useState("")
  const [travelers, setTravelers] = useState("")

  const handleAddDestination = () => {
    if (!currentDestination) return

    setDestinations([
      ...destinations,
      {
        id: Date.now(),
        name: currentDestination,
        duration: currentDuration || "3 days",
      },
    ])

    setCurrentDestination("")
    setCurrentDuration("")
  }

  const handleRemoveDestination = (id: number) => {
    setDestinations(destinations.filter((dest) => dest.id !== id))
  }

  const handleStartPlanning = () => {
    // In a real app, we would save this data to state/context/localStorage
    // For now, we'll just navigate to the planner page
    router.push("/planner")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Plan Your India Trip</CardTitle>
        <p className="text-sm text-muted-foreground">Add destinations and duration for your trip across India</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="travelers" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Number of Travelers
          </Label>
          <Input
            id="travelers"
            placeholder="e.g., 2, family, couple, group of 5"
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            You can type numbers or descriptions like "family", "couple", or "group of 5"
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Destinations
            </Label>
            {destinations.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {destinations.length} destination{destinations.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {destinations.length > 0 && (
            <div className="space-y-2 mb-4">
              {destinations.map((dest) => (
                <div key={dest.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <p className="font-medium">{dest.name}</p>
                    <p className="text-sm text-muted-foreground">{dest.duration}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveDestination(dest.id)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Select value={currentDestination} onValueChange={setCurrentDestination}>
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Select a destination" />
                </SelectTrigger>
                <SelectContent>
                  {indianDestinations.map((dest) => (
                    <SelectItem key={dest} value={dest}>
                      {dest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 3 days, 1 week"
                value={currentDuration}
                onChange={(e) => setCurrentDuration(e.target.value)}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            You can type numbers or descriptions like "1 week", "5 days", or "2 weeks"
          </p>

          <Button onClick={handleAddDestination} disabled={!currentDestination} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Destination
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartPlanning} disabled={destinations.length === 0} className="w-full">
          Start Planning
        </Button>
      </CardFooter>
    </Card>
  )
}
