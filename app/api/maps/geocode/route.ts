import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address parameter is required" }, { status: 400 })
  }

  const apiKey = process.env.AIzaSyD8r0xGGjx1GN3mWRAYGF0KMah0xAYTEFs

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key is not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error("Geocoding API request failed")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Geocoding error:", error)
    return NextResponse.json({ error: "Failed to geocode address" }, { status: 500 })
  }
}
