import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MapPin, Clock, Users } from "lucide-react"

// Mock saved itineraries
const savedItineraries = [
  {
    id: 1,
    title: "European Adventure",
    destinations: ["Paris, France", "Rome, Italy", "Barcelona, Spain"],
    startDate: "June 15, 2025",
    endDate: "June 29, 2025",
    duration: "15 days",
    travelers: 2,
  },
  {
    id: 2,
    title: "Asian Exploration",
    destinations: ["Tokyo, Japan", "Kyoto, Japan", "Seoul, South Korea"],
    startDate: "September 5, 2025",
    endDate: "September 18, 2025",
    duration: "14 days",
    travelers: 1,
  },
]

export default function ItinerariesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Itineraries</h1>
          <Link href="/planner">
            <Button>Create New Itinerary</Button>
          </Link>
        </div>

        {savedItineraries.length > 0 ? (
          <div className="grid gap-6">
            {savedItineraries.map((itinerary) => (
              <Card key={itinerary.id}>
                <CardHeader>
                  <CardTitle>{itinerary.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Destinations</p>
                          <p className="text-sm text-muted-foreground">{itinerary.destinations.join(", ")}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Dates</p>
                          <p className="text-sm text-muted-foreground">
                            {itinerary.startDate} - {itinerary.endDate}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Duration</p>
                          <p className="text-sm text-muted-foreground">{itinerary.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Travelers</p>
                          <p className="text-sm text-muted-foreground">
                            {itinerary.travelers} {itinerary.travelers === 1 ? "person" : "people"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <Link href={`/itineraries/${itinerary.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                    <Button variant="outline">Share</Button>
                    <Button variant="outline">Export</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">You don't have any saved itineraries yet.</p>
              <Link href="/planner">
                <Button>Create Your First Itinerary</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
