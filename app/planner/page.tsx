import TripPlannerWizard from "@/components/trip-planner/trip-planner-wizard"

export default function PlannerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Plan Your Trip</h1>
        <p className="text-muted-foreground mb-8">
          Create your perfect travel itinerary in a few simple steps. Choose your destinations, travel dates, and
          preferences, and we'll help you build an amazing trip.
        </p>
        <TripPlannerWizard />
      </div>
    </div>
  )
}
