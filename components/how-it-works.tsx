import { MapPin, Calendar, Compass, Share2 } from "lucide-react"

const steps = [
  {
    icon: <MapPin className="h-10 w-10" />,
    title: "Choose Indian Destinations",
    description: "Select from hundreds of destinations across India, from bustling cities to serene mountains.",
  },
  {
    icon: <Calendar className="h-10 w-10" />,
    title: "Set Your Dates",
    description: "Plan your trip duration and get real-time availability for accommodations and activities.",
  },
  {
    icon: <Compass className="h-10 w-10" />,
    title: "Customize Itinerary",
    description: "Build your perfect day-by-day plan with our drag-and-drop itinerary builder.",
  },
  {
    icon: <Share2 className="h-10 w-10" />,
    title: "Share & Go",
    description: "Save your plans, share with friends, split expenses, and start your Indian adventure.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-12 bg-muted/50 rounded-xl">
      <div className="container">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
