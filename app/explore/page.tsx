import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { Search, MapPin, Star, Globe, Sun, Snowflake, Mountain, Umbrella } from "lucide-react"

// Update the destinations array with image paths
const destinations = [
  {
    id: 1,
    name: "Delhi",
    country: "India",
    image: "/images/delhi.png",
    description: "India's capital with a perfect blend of historical monuments and modern architecture.",
    rating: 4.7,
    category: "city",
    season: "winter",
  },
  {
    id: 2,
    name: "Jaipur",
    country: "India",
    image: "/images/jaipur.png",
    description: "The Pink City known for its stunning palaces, forts, and vibrant culture.",
    rating: 4.8,
    category: "cultural",
    season: "winter",
  },
  {
    id: 3,
    name: "Goa",
    country: "India",
    image: "/images/goa.png",
    description: "Beautiful beaches, vibrant nightlife, and Portuguese-influenced architecture.",
    rating: 4.9,
    category: "beach",
    season: "winter",
  },
  {
    id: 4,
    name: "Varanasi",
    country: "India",
    image: "/images/varanasi.png",
    description: "One of the world's oldest living cities with spiritual ghats along the Ganges.",
    rating: 4.6,
    category: "cultural",
    season: "winter",
  },
  {
    id: 5,
    name: "Darjeeling",
    country: "India",
    image: "/images/darjeeling.png",
    description: "Famous for its tea plantations, stunning Himalayan views, and the Darjeeling Himalayan Railway.",
    rating: 4.7,
    category: "mountain",
    season: "summer",
  },
  {
    id: 6,
    name: "Rishikesh",
    country: "India",
    image: "/images/rishikesh.png",
    description: "The 'Yoga Capital of the World' with beautiful temples and adventure activities.",
    rating: 4.8,
    category: "mountain",
    season: "spring",
  },
  {
    id: 7,
    name: "Mumbai",
    country: "India",
    image: "/images/mumbai.png",
    description: "India's financial capital with a vibrant culture, colonial architecture, and Bollywood.",
    rating: 4.7,
    category: "city",
    season: "winter",
  },
  {
    id: 8,
    name: "Agra",
    country: "India",
    image: "/images/agra.png",
    description: "Home to the iconic Taj Mahal, Agra Fort, and Fatehpur Sikri.",
    rating: 4.9,
    category: "cultural",
    season: "winter",
  },
]

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Destinations</h1>

      <div className="relative mb-8">
        <Input placeholder="Search for destinations..." className="pl-10" />
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            <Globe className="h-4 w-4 mr-2" /> All
          </TabsTrigger>
          <TabsTrigger value="city">
            <MapPin className="h-4 w-4 mr-2" /> Cities
          </TabsTrigger>
          <TabsTrigger value="beach">
            <Umbrella className="h-4 w-4 mr-2" /> Beaches
          </TabsTrigger>
          <TabsTrigger value="mountain">
            <Mountain className="h-4 w-4 mr-2" /> Mountains
          </TabsTrigger>
          <TabsTrigger value="cultural">
            <Globe className="h-4 w-4 mr-2" /> Cultural
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap gap-4 mb-6">
          <Button variant="outline" size="sm">
            <Sun className="h-4 w-4 mr-2" /> Summer
          </Button>
          <Button variant="outline" size="sm">
            <Snowflake className="h-4 w-4 mr-2" /> Winter
          </Button>
          <Button variant="outline" size="sm">
            Popular
          </Button>
          <Button variant="outline" size="sm">
            Family-friendly
          </Button>
          <Button variant="outline" size="sm">
            Budget
          </Button>
          <Button variant="outline" size="sm">
            Luxury
          </Button>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <Link href={`/explore/${destination.id}`} key={destination.id}>
                <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={`${destination.name}, ${destination.country}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{destination.name}</h3>
                        <p className="text-muted-foreground text-sm">{destination.country}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{destination.rating}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">{destination.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        {["city", "beach", "mountain", "cultural"].map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations
                .filter((dest) => dest.category === category)
                .map((destination) => (
                  <Link href={`/explore/${destination.id}`} key={destination.id}>
                    <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={destination.image || "/placeholder.svg"}
                          alt={`${destination.name}, ${destination.country}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{destination.name}</h3>
                            <p className="text-muted-foreground text-sm">{destination.country}</p>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">{destination.rating}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2">{destination.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
