"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DestinationSelector from "./destination-selector"
import DateSelector from "./date-selector"
import PreferencesSelector from "./preferences-selector"
import ItineraryBuilder from "./itinerary-builder"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, ChevronRight, Save, Share, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type TripData = {
  destinations: string[]
  startDate: Date | undefined
  endDate: Date | undefined
  travelers: string
  preferences: {
    budget: string
    activities: string[]
    accommodation: string
    transportation: string
  }
  itinerary: any[]
}

export default function TripPlannerWizard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("destinations")
  const [tripData, setTripData] = useState<TripData>({
    destinations: [],
    startDate: undefined,
    endDate: undefined,
    travelers: "2",
    preferences: {
      budget: "medium",
      activities: [],
      accommodation: "hotel",
      transportation: "public",
    },
    itinerary: [],
  })

  const tabs = [
    { id: "destinations", label: "Destinations" },
    { id: "dates", label: "Dates" },
    { id: "travelers", label: "Travelers" },
    { id: "preferences", label: "Preferences" },
    { id: "itinerary", label: "Itinerary" },
  ]

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id)
    }
  }

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id)
    }
  }

  const handleSave = () => {
    // In a real app, this would save to a database
    localStorage.setItem("savedTrip", JSON.stringify(tripData))
    toast({
      title: "Trip saved!",
      description: "Your trip has been saved successfully.",
    })
  }

  const handleShare = () => {
    // In a real app, this would generate a shareable link
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "Share link has been copied to clipboard.",
    })
  }

  const updateTripData = (key: keyof TripData, value: any) => {
    setTripData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="destinations" className="space-y-4">
          <DestinationSelector
            selectedDestinations={tripData.destinations}
            onChange={(destinations) => updateTripData("destinations", destinations)}
          />
        </TabsContent>

        <TabsContent value="dates" className="space-y-4">
          <DateSelector
            startDate={tripData.startDate}
            endDate={tripData.endDate}
            onChange={(dates) => {
              updateTripData("startDate", dates.startDate)
              updateTripData("endDate", dates.endDate)
            }}
          />
        </TabsContent>

        <TabsContent value="travelers" className="space-y-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Who's traveling with you?</h2>
              <p className="text-muted-foreground mb-6">
                Let us know how many people are in your group to help with accommodation and activity recommendations.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="travelers" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Number of Travelers
                  </Label>
                  <Input
                    id="travelers"
                    placeholder="e.g., 2, family, couple, group of 5"
                    value={tripData.travelers}
                    onChange={(e) => updateTripData("travelers", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can type numbers or descriptions like "family", "couple", or "group of 5"
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-md mt-6">
                  <h3 className="font-medium mb-2">Travel Group Tips</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• For families with children, look for family-friendly accommodations and activities</li>
                    <li>• Larger groups may benefit from vacation rentals instead of multiple hotel rooms</li>
                    <li>• Solo travelers can join group tours to meet other travelers</li>
                    <li>• Couples might enjoy romantic dining options and private experiences</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <PreferencesSelector
            preferences={tripData.preferences}
            onChange={(preferences) => updateTripData("preferences", preferences)}
          />
        </TabsContent>

        <TabsContent value="itinerary" className="space-y-4">
          <ItineraryBuilder
            destinations={tripData.destinations}
            startDate={tripData.startDate}
            endDate={tripData.endDate}
            preferences={tripData.preferences}
            itinerary={tripData.itinerary}
            onChange={(itinerary) => updateTripData("itinerary", itinerary)}
          />
        </TabsContent>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious} disabled={activeTab === "destinations"}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          <div className="flex gap-2">
            {activeTab === "itinerary" && (
              <>
                <Button variant="outline" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share className="mr-2 h-4 w-4" /> Share
                </Button>
              </>
            )}

            <Button onClick={handleNext} disabled={activeTab === "itinerary"}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Tabs>
    </Card>
  )
}
