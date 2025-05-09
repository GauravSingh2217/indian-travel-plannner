"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, addDays, differenceInDays } from "date-fns"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  MapPin,
  Clock,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Sun,
  Coffee,
  Utensils,
  Bed,
  MapIcon,
  Wrench,
  ShoppingBag,
  Calculator,
  Car,
  Train,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MapView from "./map-view"
import WeatherWidget from "./weather-widget"
import BudgetSummary from "./budget-summary"
import TravelTimes from "./travel-times"

// Add imports for our components
import ShoppingDestinations from "./shopping-destinations"
import CurrencyConverter from "./currency-converter"
import PackingList from "./packing-list"
import ExpenseSplitter from "./expense-splitter"

// Update the activity suggestions with Indian destinations
const activitySuggestions = {
  "Delhi, India": [
    {
      id: "delhi-1",
      title: "Red Fort Visit",
      time: "10:00 AM",
      duration: "2 hours",
      type: "sightseeing",
      location: "Netaji Subhash Marg, Lal Qila",
    },
    {
      id: "delhi-2",
      title: "Qutub Minar Tour",
      time: "1:00 PM",
      duration: "1.5 hours",
      type: "culture",
      location: "Mehrauli",
    },
    {
      id: "delhi-3",
      title: "India Gate Visit",
      time: "4:00 PM",
      duration: "1 hour",
      type: "sightseeing",
      location: "Rajpath",
    },
    {
      id: "delhi-4",
      title: "Dinner at Karim's",
      time: "7:00 PM",
      duration: "2 hours",
      type: "food",
      location: "Jama Masjid",
    },
  ],
  "Mumbai, India": [
    {
      id: "mumbai-1",
      title: "Gateway of India Visit",
      time: "9:00 AM",
      duration: "1 hour",
      type: "sightseeing",
      location: "Apollo Bunder",
    },
    {
      id: "mumbai-2",
      title: "Marine Drive Walk",
      time: "11:00 AM",
      duration: "1.5 hours",
      type: "sightseeing",
      location: "Marine Drive",
    },
    {
      id: "mumbai-3",
      title: "Elephanta Caves Tour",
      time: "2:00 PM",
      duration: "3 hours",
      type: "culture",
      location: "Elephanta Island",
    },
    {
      id: "mumbai-4",
      title: "Street Food at Juhu Beach",
      time: "6:30 PM",
      duration: "2 hours",
      type: "food",
      location: "Juhu Beach",
    },
  ],
  "Jaipur, India": [
    {
      id: "jaipur-1",
      title: "Amber Fort Tour",
      time: "9:00 AM",
      duration: "3 hours",
      type: "culture",
      location: "Amer",
    },
    {
      id: "jaipur-2",
      title: "City Palace Visit",
      time: "1:00 PM",
      duration: "2 hours",
      type: "culture",
      location: "Jaleb Chowk",
    },
    {
      id: "jaipur-3",
      title: "Hawa Mahal Visit",
      time: "4:00 PM",
      duration: "1 hour",
      type: "sightseeing",
      location: "Badi Choupad",
    },
    {
      id: "jaipur-4",
      title: "Traditional Rajasthani Dinner",
      time: "7:30 PM",
      duration: "2 hours",
      type: "food",
      location: "Chokhi Dhani",
    },
  ],
  "Goa, India": [
    {
      id: "goa-1",
      title: "Calangute Beach",
      time: "9:00 AM",
      duration: "3 hours",
      type: "beach",
      location: "North Goa",
    },
    {
      id: "goa-2",
      title: "Basilica of Bom Jesus",
      time: "1:00 PM",
      duration: "1.5 hours",
      type: "culture",
      location: "Old Goa",
    },
    {
      id: "goa-3",
      title: "Dudhsagar Waterfall Trip",
      time: "3:00 PM",
      duration: "4 hours",
      type: "nature",
      location: "Bhagwan Mahavir Wildlife Sanctuary",
    },
    {
      id: "goa-4",
      title: "Seafood Dinner & Nightlife",
      time: "8:00 PM",
      duration: "3 hours",
      type: "food",
      location: "Baga Beach",
    },
  ],
}

// Activity type icons
const activityIcons: Record<string, React.ReactNode> = {
  breakfast: <Coffee className="h-4 w-4" />,
  lunch: <Utensils className="h-4 w-4" />,
  dinner: <Utensils className="h-4 w-4" />,
  sightseeing: <MapPin className="h-4 w-4" />,
  culture: <MapIcon className="h-4 w-4" />,
  nature: <Sun className="h-4 w-4" />,
  food: <Utensils className="h-4 w-4" />,
  nightlife: <Bed className="h-4 w-4" />,
  transportation: <MapIcon className="h-4 w-4" />,
}

interface ItineraryBuilderProps {
  destinations: string[]
  startDate: Date | undefined
  endDate: Date | undefined
  preferences: {
    budget: string
    activities: string[]
    accommodation: string
    transportation: string
  }
  itinerary: any[]
  onChange: (itinerary: any[]) => void
  travelers?: string
}

export default function ItineraryBuilder({
  destinations,
  startDate,
  endDate,
  preferences,
  itinerary,
  onChange,
  travelers = "2",
}: ItineraryBuilderProps) {
  // Add this ref to prevent infinite loops
  const isInitialMount = useRef(true)
  const prevItineraryRef = useRef<any[]>([])

  // Add this state for transportation mode
  const [transportationMode, setTransportationMode] = useState<"DRIVING" | "WALKING" | "BICYCLING" | "TRANSIT">(
    "DRIVING",
  )
  const [showMap, setShowMap] = useState(false)

  const [days, setDays] = useState<any[]>([])
  const [activeDay, setActiveDay] = useState("day-1")
  const [isEditingActivity, setIsEditingActivity] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<any>(null)
  const [activeSection, setActiveSection] = useState<string>("itinerary")
  const [shoppingBudget, setShoppingBudget] = useState(0)

  // Generate days based on start and end dates
  useEffect(() => {
    if (startDate && endDate) {
      const dayCount = differenceInDays(endDate, startDate) + 1
      const generatedDays = Array.from({ length: dayCount }, (_, i) => {
        const date = addDays(startDate, i)
        return {
          id: `day-${i + 1}`,
          date,
          dateFormatted: format(date, "EEEE, MMMM d"),
          activities: [],
        }
      })

      // If we already have an itinerary, use it
      if (itinerary.length > 0) {
        setDays(itinerary)
      } else {
        // Otherwise generate a new one with suggested activities
        const newDays = generatedDays.map((day, index) => {
          // Alternate between destinations if multiple are selected
          const destination = destinations[index % destinations.length]

          // Get suggested activities for this destination
          const suggestions = activitySuggestions[destination] || []

          // Add some default activities
          const defaultActivities = [
            {
              id: `${day.id}-breakfast`,
              title: "Breakfast",
              time: "8:00 AM",
              duration: "1 hour",
              type: "breakfast",
              location: "Hotel",
            },
            // Add 2 suggested activities if available
            ...suggestions.slice(0, 2).map((activity) => ({
              ...activity,
              id: `${day.id}-${activity.id}`,
            })),
            {
              id: `${day.id}-lunch`,
              title: "Lunch",
              time: "1:00 PM",
              duration: "1 hour",
              type: "lunch",
              location: "Local Restaurant",
            },
            // Add 1 more suggested activity if available
            ...suggestions.slice(2, 3).map((activity) => ({
              ...activity,
              id: `${day.id}-${activity.id}`,
            })),
            {
              id: `${day.id}-dinner`,
              title: "Dinner",
              time: "7:00 PM",
              duration: "1.5 hours",
              type: "dinner",
              location: "Restaurant",
            },
          ]

          return {
            ...day,
            destination,
            activities: defaultActivities,
          }
        })

        setDays(newDays)

        // Only call onChange on initial mount or when destinations/dates change
        if (!isInitialMount.current) {
          onChange(newDays)
        }
      }
    }

    // Set initial mount to false after first render
    if (isInitialMount.current) {
      isInitialMount.current = false
    }
  }, [startDate, endDate, destinations, preferences, itinerary, onChange])

  // Update parent component only when days actually change
  useEffect(() => {
    // Skip the first render and when days is empty
    if (days.length > 0 && !isInitialMount.current) {
      // Only call onChange if the days have actually changed
      if (JSON.stringify(prevItineraryRef.current) !== JSON.stringify(days)) {
        prevItineraryRef.current = days
        onChange(days)
      }
    }
  }, [days, onChange])

  // Calculate trip duration
  const tripDuration = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0

  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    const { destination, source } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    // Find the day we're working with
    const dayIndex = days.findIndex((day) => day.id === source.droppableId)
    if (dayIndex === -1) return

    const newDays = [...days]
    const activities = [...newDays[dayIndex].activities]

    // Remove from source
    const [removed] = activities.splice(source.index, 1)

    // If moving to a different day
    if (destination.droppableId !== source.droppableId) {
      const destDayIndex = days.findIndex((day) => day.id === destination.droppableId)
      if (destDayIndex === -1) return

      // Add to destination day
      const destActivities = [...newDays[destDayIndex].activities]
      destActivities.splice(destination.index, 0, removed)
      newDays[destDayIndex].activities = destActivities
    } else {
      // Add to same day but different position
      activities.splice(destination.index, 0, removed)
    }

    newDays[dayIndex].activities = activities
    setDays(newDays)
  }

  // Add a new activity
  const handleAddActivity = (dayId: string) => {
    const dayIndex = days.findIndex((day) => day.id === dayId)
    if (dayIndex === -1) return

    const newActivity = {
      id: `${dayId}-activity-${Date.now()}`,
      title: "New Activity",
      time: "12:00 PM",
      duration: "1 hour",
      type: "sightseeing",
      location: "",
    }

    setCurrentActivity(newActivity)
    setIsEditingActivity(true)
  }

  // Edit an activity
  const handleEditActivity = (dayId: string, activity: any) => {
    setCurrentActivity({ ...activity, dayId })
    setIsEditingActivity(true)
  }

  // Save activity changes
  const handleSaveActivity = (activity: any) => {
    const dayIndex = days.findIndex((day) => day.id === activity.dayId || activeDay)
    if (dayIndex === -1) return

    const newDays = [...days]
    const activities = [...newDays[dayIndex].activities]

    // Check if this is a new activity or editing existing
    const activityIndex = activities.findIndex((a) => a.id === activity.id)

    if (activityIndex === -1) {
      // New activity
      activities.push(activity)
    } else {
      // Update existing
      activities[activityIndex] = activity
    }

    newDays[dayIndex].activities = activities
    setDays(newDays)
    setIsEditingActivity(false)
  }

  // Delete an activity
  const handleDeleteActivity = (dayId: string, activityId: string) => {
    const dayIndex = days.findIndex((day) => day.id === dayId)
    if (dayIndex === -1) return

    const newDays = [...days]
    newDays[dayIndex].activities = newDays[dayIndex].activities.filter((activity) => activity.id !== activityId)

    setDays(newDays)
  }

  // Update shopping budget when it changes
  useEffect(() => {
    // Get shopping budget from shopping destinations component
    if (activeSection === "shopping") {
      // This would typically come from the shopping component's state
      // For now, we'll simulate it with a calculation based on destinations
      const estimatedBudget = destinations.length * 5000 // 5000 INR per destination
      setShoppingBudget(estimatedBudget)
    }
  }, [activeSection, destinations])

  // Add this section where the map is rendered
  const renderMapSection = () => {
    return (
      <>
        {showMap && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <MapView destinations={destinations} itinerary={days} transportationMode={transportationMode} />
            </CardContent>
          </Card>
        )}

        {/* Add the transportation mode selector */}
        {showMap && destinations.length > 1 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Transportation Mode</h3>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={transportationMode === "DRIVING" ? "default" : "outline"}
                onClick={() => setTransportationMode("DRIVING")}
                className="flex items-center"
              >
                <Car className="h-4 w-4 mr-1" /> Driving
              </Button>
              <Button
                size="sm"
                variant={transportationMode === "WALKING" ? "default" : "outline"}
                onClick={() => setTransportationMode("WALKING")}
                className="flex items-center"
              >
                Walking
              </Button>
              <Button
                size="sm"
                variant={transportationMode === "TRANSIT" ? "default" : "outline"}
                onClick={() => setTransportationMode("TRANSIT")}
                className="flex items-center"
              >
                <Train className="h-4 w-4 mr-1" /> Transit
              </Button>
            </div>
          </div>
        )}

        {/* Add the travel times component */}
        {showMap && destinations.length > 1 && (
          <div className="mb-6">
            <TravelTimes destinations={destinations} transportationMode={transportationMode} />
          </div>
        )}
      </>
    )
  }

  if (!startDate || !endDate || destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Please select your destinations and travel dates first to build your itinerary.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Travel Itinerary</h2>
        <Button variant="outline" onClick={() => setShowMap(!showMap)}>
          <MapIcon className="h-4 w-4 mr-2" />
          {showMap ? "Hide Map" : "Show Map"}
        </Button>
      </div>

      {/* Add the map section here */}
      {renderMapSection()}

      {/* Budget Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BudgetSummary
          destinations={destinations}
          duration={tripDuration}
          travelers={travelers}
          preferences={preferences}
          shoppingBudget={shoppingBudget}
        />
      </div>

      {/* Main section tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="itinerary" className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Itinerary
          </TabsTrigger>
          <TabsTrigger value="shopping" className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Shopping
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center">
            <Wrench className="h-4 w-4 mr-2" />
            Tools
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center">
            <Calculator className="h-4 w-4 mr-2" />
            Budget
          </TabsTrigger>
        </TabsList>

        {/* Itinerary Section */}
        <TabsContent value="itinerary" className="space-y-6">
          <Tabs value={activeDay} onValueChange={setActiveDay}>
            <TabsList className="mb-4 flex overflow-x-auto pb-2">
              {days.map((day) => (
                <TabsTrigger key={day.id} value={day.id} className="min-w-[120px]">
                  Day {day.id.split("-")[1]}
                </TabsTrigger>
              ))}
            </TabsList>

            <DragDropContext onDragEnd={handleDragEnd}>
              {days.map((day) => (
                <TabsContent key={day.id} value={day.id} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{day.dateFormatted}</h3>
                      {day.destination && (
                        <p className="text-muted-foreground flex items-center">
                          <MapPin className="h-4 w-4 mr-1" /> {day.destination}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <WeatherWidget destination={day.destination} date={day.date} />
                      <Button size="sm" variant="outline" onClick={() => handleAddActivity(day.id)}>
                        <Plus className="h-4 w-4 mr-1" /> Add Activity
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-4">
                      <Droppable droppableId={day.id}>
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                            {day.activities.length === 0 ? (
                              <p className="text-center py-8 text-muted-foreground">
                                No activities planned for this day. Click "Add Activity" to get started.
                              </p>
                            ) : (
                              day.activities.map((activity: any, index: number) => (
                                <Draggable key={activity.id} draggableId={activity.id} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="bg-muted p-3 rounded-md"
                                    >
                                      <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-3">
                                          <div className="bg-primary/10 text-primary p-2 rounded-md">
                                            {activityIcons[activity.type] || <MapPin className="h-4 w-4" />}
                                          </div>
                                          <div>
                                            <h4 className="font-medium">{activity.title}</h4>
                                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                                              <Clock className="h-3 w-3 mr-1" />
                                              {activity.time} ({activity.duration})
                                            </div>
                                            {activity.location && (
                                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {activity.location}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex gap-1">
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleEditActivity(day.id, activity)}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDeleteActivity(day.id, activity.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </DragDropContext>
          </Tabs>
        </TabsContent>

        {/* Shopping Section */}
        <TabsContent value="shopping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Shopping Destinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {days.length > 0 && days[0].destination ? (
                <ShoppingDestinations destination={days[0].destination} />
              ) : (
                <p className="text-muted-foreground">
                  No destination selected yet. Please select a destination to see shopping options.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tools Section */}
        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="h-5 w-5 mr-2" />
                  Travel Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="packing">
                  <TabsList className="w-full">
                    <TabsTrigger value="packing">Packing List</TabsTrigger>
                    <TabsTrigger value="expenses">Expense Splitter</TabsTrigger>
                    <TabsTrigger value="currency">Currency Converter</TabsTrigger>
                  </TabsList>

                  <TabsContent value="packing" className="pt-4">
                    <PackingList destination={days.length > 0 ? days[0].destination : undefined} />
                  </TabsContent>

                  <TabsContent value="expenses" className="pt-4">
                    <ExpenseSplitter />
                  </TabsContent>

                  <TabsContent value="currency" className="pt-4">
                    <CurrencyConverter />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Budget Section */}
        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Detailed Budget Planner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <BudgetSummary
                  destinations={destinations}
                  duration={tripDuration}
                  travelers={travelers}
                  preferences={preferences}
                  shoppingBudget={shoppingBudget}
                />

                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Budget Tips for India</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Street food is delicious and budget-friendly, but choose busy stalls with high turnover</li>
                    <li>• Local transportation like buses and metros are very economical in most Indian cities</li>
                    <li>• Many attractions have different pricing for locals and tourists</li>
                    <li>• Bargaining is expected in markets, but not in fixed-price shops</li>
                    <li>• Consider homestays for an authentic experience at lower costs than hotels</li>
                    <li>• Travel during shoulder season (Feb-Mar, Sep-Oct) for better rates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Activity Edit Dialog */}
      <Dialog open={isEditingActivity} onOpenChange={setIsEditingActivity}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentActivity?.id.includes("activity-") ? "Add Activity" : "Edit Activity"}</DialogTitle>
          </DialogHeader>

          {currentActivity && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Activity Title</Label>
                <Input
                  id="title"
                  value={currentActivity.title}
                  onChange={(e) =>
                    setCurrentActivity({
                      ...currentActivity,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    value={currentActivity.time}
                    onChange={(e) =>
                      setCurrentActivity({
                        ...currentActivity,
                        time: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={currentActivity.duration}
                    onChange={(e) =>
                      setCurrentActivity({
                        ...currentActivity,
                        duration: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Activity Type</Label>
                <Select
                  value={currentActivity.type}
                  onValueChange={(value) =>
                    setCurrentActivity({
                      ...currentActivity,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="sightseeing">Sightseeing</SelectItem>
                    <SelectItem value="culture">Museums & Culture</SelectItem>
                    <SelectItem value="nature">Nature & Outdoors</SelectItem>
                    <SelectItem value="food">Food & Dining</SelectItem>
                    <SelectItem value="nightlife">Nightlife</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={currentActivity.location}
                  onChange={(e) =>
                    setCurrentActivity({
                      ...currentActivity,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={currentActivity.notes || ""}
                  onChange={(e) =>
                    setCurrentActivity({
                      ...currentActivity,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Add any additional notes or details..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditingActivity(false)}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button onClick={() => handleSaveActivity(currentActivity)}>
                  <Save className="h-4 w-4 mr-2" /> Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
