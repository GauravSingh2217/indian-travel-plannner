import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destination, waypoints, travelMode, optimize } = body

    if (!origin || !destination) {
      return NextResponse.json({ error: "Origin and destination are required" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API key is not configured" }, { status: 500 })
    }

    // Build waypoints string if provided
    let waypointsParam = ""
    if (waypoints && waypoints.length > 0) {
      const waypointStrings = waypoints.map((wp: any) => `via:${encodeURIComponent(wp.location)}`)
      waypointsParam = `&waypoints=${optimize ? "optimize:true|" : ""}${waypointStrings.join("|")}`
    }

    // Default to DRIVING if not specified
    const mode = travelMode || "DRIVING"

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${waypointsParam}&mode=${mode.toLowerCase()}&key=${apiKey}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Directions API request failed")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Directions error:", error)
    return NextResponse.json({ error: "Failed to get directions" }, { status: 500 })
  }
}
