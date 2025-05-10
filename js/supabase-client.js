import { createClient } from "@supabase/supabase-js"

// Create a singleton Supabase client for use throughout the application
const createSupabaseClient = () => {
  const supabaseUrl = "https://poxfhqpvwswktsrwqfov.supabase.co"
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBveGZocXB2d3N3a3RzcndxZm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NTA4NDEsImV4cCI6MjA2MTIyNjg0MX0.dYIcHcbCd44O3YwL950pw-f3cyQzQr1WPOG2wtVwUSg"

  // Initialize the Supabase client
  return createClient(supabaseUrl, supabaseKey)
}

// Create and export the Supabase client instance
const supabaseClient = createSupabaseClient()
