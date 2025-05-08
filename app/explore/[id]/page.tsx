"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, Calendar, Clock, ArrowLeft, Hotel, Utensils, Ticket } from "lucide-react"
import DestinationMap from "@/components/destination-map"

// Destination data
const destinations = [
  {
    id: "1",
    name: "Delhi",
    country: "India",
    image: "/images/delhi.png",
    description: "India's capital with a perfect blend of historical monuments and modern architecture.",
    longDescription:
      "Delhi, India's capital territory, is a massive metropolitan area in the country's north. In Old Delhi, a neighborhood dating to the 1600s, stands the imposing Mughal-era Red Fort, a symbol of India, and the sprawling Jama Masjid mosque, whose courtyard accommodates 25,000 people. Nearby is Chandni Chowk, a vibrant bazaar filled with food carts, sweets shops and spice stalls.",
    rating: 4.7,
    category: "city",
    season: "winter",
    attractions: [
      {
        name: "Red Fort",
        description: "Historic red sandstone fort built in the 17th century",
        location: "Netaji Subhash Marg, Lal Qila",
      },
      {
        name: "Qutub Minar",
        description: "UNESCO World Heritage Site with a 73-meter tall minaret",
        location: "Mehrauli",
      },
      {
        name: "India Gate",
        description: "War memorial dedicated to soldiers of the British Indian Army",
        location: "Rajpath",
      },
      {
        name: "Humayun's Tomb",
        description: "Tomb of the Mughal Emperor Humayun",
        location: "Mathura Road, Nizamuddin East",
      },
    ],
    hotels: [
      { name: "The Imperial", rating: 5, priceRange: "₹₹₹₹" },
      { name: "The Leela Palace", rating: 5, priceRange: "₹₹₹₹" },
      { name: "The Taj Mahal Hotel", rating: 5, priceRange: "₹₹₹" },
      { name: "The Claridges", rating: 4, priceRange: "₹₹" },
    ],
    restaurants: [
      { name: "Indian Accent", cuisine: "Modern Indian", priceRange: "₹₹₹₹" },
      { name: "Bukhara", cuisine: "North Indian", priceRange: "₹₹₹" },
      { name: "Karim's", cuisine: "Mughlai", priceRange: "₹₹" },
      { name: "Saravana Bhavan", cuisine: "South Indian", priceRange: "₹" },
    ],
    bestTimeToVisit: "October to March",
    averageTemperature: "Summer: 25-45°C, Winter: 5-25°C",
  },
  {
    id: "2",
    name: "Jaipur",
    country: "India",
    image: "/images/jaipur.png",
    description: "The Pink City known for its stunning palaces, forts, and vibrant culture.",
    longDescription:
      "Jaipur is the capital of India's Rajasthan state. It evokes the royal family that once ruled the region and that, in 1727, founded what is now called the Old City, or 'Pink City' for its trademark building color. At the center of its stately street grid stands the opulent, colonnaded City Palace complex. With gardens, courtyards and museums, part of it is still a royal residence.",
    rating: 4.8,
    category: "cultural",
    season: "winter",
    attractions: [
      { name: "Amber Fort", description: "Majestic fort overlooking Maota Lake", location: "Amer" },
      { name: "City Palace", description: "Palace complex with museums and gardens", location: "Jaleb Chowk" },
      { name: "Hawa Mahal", description: "Palace with a unique honeycomb facade", location: "Badi Choupad" },
      {
        name: "Jantar Mantar",
        description: "UNESCO World Heritage site with astronomical instruments",
        location: "Kanwar Nagar",
      },
    ],
    hotels: [
      { name: "Rambagh Palace", rating: 5, priceRange: "₹₹₹₹" },
      { name: "Taj Jai Mahal Palace", rating: 5, priceRange: "₹₹₹" },
      { name: "ITC Rajputana", rating: 4, priceRange: "₹₹₹" },
      { name: "Trident Jaipur", rating: 4, priceRange: "₹₹" },
    ],
    restaurants: [
      { name: "Suvarna Mahal", cuisine: "Royal Indian", priceRange: "₹₹₹₹" },
      { name: "Cinnamon", cuisine: "Rajasthani", priceRange: "₹₹₹" },
      { name: "Niros", cuisine: "Multi-cuisine", priceRange: "₹₹" },
      { name: "Laxmi Misthan Bhandar", cuisine: "Vegetarian", priceRange: "₹" },
    ],
    bestTimeToVisit: "October to March",
    averageTemperature: "Summer: 25-40°C, Winter: 8-25°C",
  },
  // Add more destinations as needed
]

export default function DestinationDetail() {
  const params = useParams()
  const [destination, setDestination] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Find the destination by ID
    const foundDestination = destinations.find((d) => d.id === params.id)

    if (foundDestination) {
      setDestination(foundDestination)
    }

    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading destination details...</p>
        </div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl font-semibold mb-4">Destination not found</p>
          <Link href="/explore">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Explore
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/explore" className="inline-flex items-center mb-6 text-sm hover:underline">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-6">
            <Image
              src={destination.image || "/placeholder.svg"}
              alt={`${destination.name}, ${destination.country}`}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">{destination.name}</h1>
              <p className="text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1" /> {destination.country}
              </p>
            </div>
            <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-medium">{destination.rating}</span>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-lg">{destination.longDescription}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Best Time to Visit</h3>
              </div>
              <p>{destination.bestTimeToVisit}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Average Temperature</h3>
              </div>
              <p>{destination.averageTemperature}</p>
            </div>
          </div>

          <Tabs defaultValue="attractions" className="mb-8">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="attractions">Attractions</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            </TabsList>

            <TabsContent value="attractions" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.attractions.map((attraction: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{attraction.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{attraction.description}</p>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>{attraction.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hotels" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.hotels.map((hotel: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{hotel.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm ml-1">{hotel.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center mt-2">
                        <Hotel className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{hotel.priceRange}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="restaurants" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.restaurants.map((restaurant: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                      <div className="flex items-center mt-1">
                        <Utensils className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">{restaurant.cuisine}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Price: {restaurant.priceRange}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Location</h2>
            <DestinationMap
              destination={`${destination.name}, ${destination.country}`}
              attractions={destination.attractions}
            />
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/planner">
              <Button size="lg">
                <Ticket className="h-4 w-4 mr-2" /> Plan a Trip to {destination.name}
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge className="mt-1">{destination.category}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best Season</p>
                <Badge variant="outline" className="mt-1">
                  {destination.season}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Popular For</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {destination.attractions.slice(0, 3).map((attraction: any, index: number) => (
                    <Badge key={index} variant="secondary">
                      {attraction.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nearby Destinations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {destinations
                  .filter((d: any) => d.id !== destination.id)
                  .slice(0, 3)
                  .map((dest: any) => (
                    <Link href={`/explore/${dest.id}`} key={dest.id}>
                      <div className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image src={dest.image || "/placeholder.svg"} alt={dest.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="font-medium">{dest.name}</h3>
                          <p className="text-sm text-muted-foreground">{dest.country}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
