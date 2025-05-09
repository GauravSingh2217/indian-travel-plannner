import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.AIzaSyD8r0xGGjx1GN3mWRAYGF0KMah0xAYTEFs

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key is not configured" }, { status: 500 })
  }

  // Return the API key in a secure way
  return NextResponse.json({ apiKey })
}
