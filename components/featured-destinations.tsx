import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

const destinations = [
  {
    id: 1,
    name: "Delhi",
    image: "/images/delhi.png",
    description: "India's capital with a perfect blend of historical monuments and modern architecture.",
  },
  {
    id: 2,
    name: "Jaipur",
    image: "/images/jaipur.png",
    description: "The Pink City known for its stunning palaces, forts, and vibrant culture.",
  },
  {
    id: 3,
    name: "Goa",
    image: "/images/goa.png",
    description: "Beautiful beaches, vibrant nightlife, and Portuguese-influenced architecture.",
  },
  {
    id: 4,
    name: "Varanasi",
    image: "/images/varanasi.png",
    description: "One of the world's oldest living cities with spiritual ghats along the Ganges.",
  },
]

export default function FeaturedDestinations() {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <Link href={`/explore/${destination.id}`} key={destination.id}>
              <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-lg">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{destination.name}</h3>
                  <p className="text-muted-foreground text-sm">{destination.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
