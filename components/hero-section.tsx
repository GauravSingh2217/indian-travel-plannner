import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Discover Incredible India
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Plan your perfect journey across India with our interactive travel planner. From the Himalayas to the
                beaches of Goa, create custom itineraries and explore the rich diversity of Indian culture.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/planner">
                <Button size="lg" className="font-semibold">
                  Start Planning
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="font-semibold">
                  Explore Destinations
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl lg:aspect-square">
            <Image
              src="/images/india-hero.png"
              alt="India travel destinations collage"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
