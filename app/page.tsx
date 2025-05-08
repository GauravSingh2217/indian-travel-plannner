import { Button } from "@/components/ui/button"
import Link from "next/link"
import FeaturedDestinations from "@/components/featured-destinations"
import HeroSection from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />

      <FeaturedDestinations />
      <HowItWorks />

      <section className="my-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Plan Your Dream Trip?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Create your personalized travel itinerary in minutes with our intuitive planner. Discover new places, find the
          best activities, and make memories that last a lifetime.
        </p>
        <Link href="/planner">
          <Button size="lg" className="font-semibold">
            Start Planning Now
          </Button>
        </Link>
      </section>
    </div>
  )
}
