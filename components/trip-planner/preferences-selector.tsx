"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Wallet,
  Hotel,
  Tent,
  Home,
  Train,
  Car,
  Plane,
  Utensils,
  Camera,
  Mountain,
  Umbrella,
  Music,
  LibraryIcon as Museum,
} from "lucide-react"

interface PreferencesSelectorProps {
  preferences: {
    budget: string
    activities: string[]
    accommodation: string
    transportation: string
  }
  onChange: (preferences: {
    budget: string
    activities: string[]
    accommodation: string
    transportation: string
  }) => void
}

const activities = [
  { id: "sightseeing", label: "Sightseeing", icon: <Camera className="h-4 w-4 mr-2" /> },
  { id: "nature", label: "Nature & Outdoors", icon: <Mountain className="h-4 w-4 mr-2" /> },
  { id: "beach", label: "Beach", icon: <Umbrella className="h-4 w-4 mr-2" /> },
  { id: "food", label: "Food & Dining", icon: <Utensils className="h-4 w-4 mr-2" /> },
  { id: "nightlife", label: "Nightlife", icon: <Music className="h-4 w-4 mr-2" /> },
  { id: "culture", label: "Museums & Culture", icon: <Museum className="h-4 w-4 mr-2" /> },
]

export default function PreferencesSelector({ preferences, onChange }: PreferencesSelectorProps) {
  const [budget, setBudget] = useState(preferences.budget)
  const [selectedActivities, setSelectedActivities] = useState<string[]>(preferences.activities)
  const [accommodation, setAccommodation] = useState(preferences.accommodation)
  const [transportation, setTransportation] = useState(preferences.transportation)

  const handleBudgetChange = (value: string) => {
    setBudget(value)
    onChange({
      ...preferences,
      budget: value,
    })
  }

  const handleActivityToggle = (activity: string) => {
    const updatedActivities = selectedActivities.includes(activity)
      ? selectedActivities.filter((a) => a !== activity)
      : [...selectedActivities, activity]

    setSelectedActivities(updatedActivities)
    onChange({
      ...preferences,
      activities: updatedActivities,
    })
  }

  const handleAccommodationChange = (value: string) => {
    setAccommodation(value)
    onChange({
      ...preferences,
      accommodation: value,
    })
  }

  const handleTransportationChange = (value: string) => {
    setTransportation(value)
    onChange({
      ...preferences,
      transportation: value,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Travel Preferences</h2>
        <p className="text-muted-foreground mb-6">
          Tell us about your preferences to help us create the perfect itinerary for you.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-4">
                <Wallet className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-medium">Budget</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-4">What's your budget range for this trip?</p>

              <RadioGroup value={budget} onValueChange={handleBudgetChange} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="budget" id="budget" />
                  <Label htmlFor="budget">Budget-friendly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Mid-range</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="luxury" id="luxury" />
                  <Label htmlFor="luxury">Luxury</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <Camera className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-medium">Activities</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-4">What types of activities are you interested in?</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={activity.id}
                      checked={selectedActivities.includes(activity.id)}
                      onCheckedChange={() => handleActivityToggle(activity.id)}
                    />
                    <Label htmlFor={activity.id} className="flex items-center">
                      {activity.icon}
                      {activity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <Hotel className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-medium">Accommodation</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-4">What type of accommodation do you prefer?</p>

              <RadioGroup
                value={accommodation}
                onValueChange={handleAccommodationChange}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hotel" id="hotel" />
                  <Label htmlFor="hotel" className="flex items-center">
                    <Hotel className="h-4 w-4 mr-2" />
                    Hotels
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hostel" id="hostel" />
                  <Label htmlFor="hostel" className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Hostels
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="apartment" id="apartment" />
                  <Label htmlFor="apartment" className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Vacation Rentals
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="camping" id="camping" />
                  <Label htmlFor="camping" className="flex items-center">
                    <Tent className="h-4 w-4 mr-2" />
                    Camping
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <Train className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-medium">Transportation</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-4">How do you prefer to get around during your trip?</p>

              <RadioGroup
                value={transportation}
                onValueChange={handleTransportationChange}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="flex items-center">
                    <Train className="h-4 w-4 mr-2" />
                    Public Transportation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rental" id="rental" />
                  <Label htmlFor="rental" className="flex items-center">
                    <Car className="h-4 w-4 mr-2" />
                    Rental Car
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="taxi" id="taxi" />
                  <Label htmlFor="taxi" className="flex items-center">
                    <Car className="h-4 w-4 mr-2" />
                    Taxis/Rideshares
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flights" id="flights" />
                  <Label htmlFor="flights" className="flex items-center">
                    <Plane className="h-4 w-4 mr-2" />
                    Internal Flights
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
