import { NextResponse } from "next/server"

export async function GET() {
  // Instead of returning the API key directly, we'll return a boolean indicating if it's configured
  const apiKeyExists = !!process.env.GOOGLE_MAPS_API_KEY

  if (!apiKeyExists) {
    return NextResponse.json({ error: "Google Maps API key is not configured" }, { status: 500 })
  }

  // Return a success response without the actual API key
  return NextResponse.json({ configured: true })
}
