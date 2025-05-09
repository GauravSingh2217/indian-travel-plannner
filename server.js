// Import required modules
const express = require("express")
const cors = require("cors")
const { createClient } = require("@supabase/supabase-js")
const bcrypt = require("bcryptjs")
const bodyParser = require("body-parser")
const path = require("path")

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "/")))

// Initialize Supabase client
const supabaseUrl = process.env.https://poxfhqpvwswktsrwqfov.supabase.co
const supabaseKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBveGZocXB2d3N3a3RzcndxZm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NTA4NDEsImV4cCI6MjA2MTIyNjg0MX0.dYIcHcbCd44O3YwL950pw-f3cyQzQr1WPOG2wtVwUSg
const supabase = createClient(https://poxfhqpvwswktsrwqfov.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBveGZocXB2d3N3a3RzcndxZm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NTA4NDEsImV4cCI6MjA2MTIyNjg0MX0.dYIcHcbCd44O3YwL950pw-f3cyQzQr1WPOG2wtVwUSg)



// Create database tables if they don't exist
async function setupDatabase() {
  try {
    // Check if users table exists
    const { data: usersTable } = await supabase
      .from("users")
      .select("*")
      .limit(1)
      .catch(() => ({ data: null }))

    // Check if itineraries table exists
    const { data: itinerariesTable } = await supabase
      .from("itineraries")
      .select("*")
      .limit(1)
      .catch(() => ({ data: null }))

    // If tables don't exist, create them
    if (!usersTable) {
      console.log("Creating users table...")
      await supabase.rpc("create_users_table")
    }

    if (!itinerariesTable) {
      console.log("Creating itineraries table...")
      await supabase.rpc("create_itineraries_table")
    }

    console.log("Database setup complete")
  } catch (error) {
    console.error("Error setting up database:", error)
  }
}

// API Routes

// Register a new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("*").eq("email", email).single()

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Insert new user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password: hashedPassword,
        },
      ])
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // Return user data without password
    const user = data[0]
    delete user.password

    res.status(201).json({ user })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Login user
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error || !user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Return user data without password
    delete user.password

    res.json({ user })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get user profile
app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params

    const { data: user, error } = await supabase
      .from("users")
      .select("id, first_name, last_name, email, created_at")
      .eq("id", id)
      .single()

    if (error || !user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Create a new itinerary
app.post("/api/itineraries", async (req, res) => {
  try {
    const {
      user_id,
      title,
      destinations,
      start_date,
      end_date,
      travelers,
      budget,
      activities,
      accommodation,
      transportation,
      itinerary_data,
    } = req.body

    const { data, error } = await supabase
      .from("itineraries")
      .insert([
        {
          user_id,
          title,
          destinations,
          start_date,
          end_date,
          travelers,
          budget,
          activities,
          accommodation,
          transportation,
          itinerary_data,
        },
      ])
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.status(201).json({ itinerary: data[0] })
  } catch (error) {
    console.error("Create itinerary error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get all itineraries for a user
app.get("/api/itineraries/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const { data, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ itineraries: data })
  } catch (error) {
    console.error("Get itineraries error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get a specific itinerary
app.get("/api/itineraries/:id", async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase.from("itineraries").select("*").eq("id", id).single()

    if (error || !data) {
      return res.status(404).json({ error: "Itinerary not found" })
    }

    res.json({ itinerary: data })
  } catch (error) {
    console.error("Get itinerary error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Update an itinerary
app.put("/api/itineraries/:id", async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase.from("itineraries").update(updates).eq("id", id).select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Itinerary not found" })
    }

    res.json({ itinerary: data[0] })
  } catch (error) {
    console.error("Update itinerary error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Delete an itinerary
app.delete("/api/itineraries/:id", async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase.from("itineraries").delete().eq("id", id)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ message: "Itinerary deleted successfully" })
  } catch (error) {
    console.error("Delete itinerary error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Serve the HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.get("/:page", (req, res) => {
  const page = req.params.page
  res.sendFile(path.join(__dirname, `${page}.html`))
})

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
  await setupDatabase()
})
