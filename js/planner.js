import { createClient } from "@supabase/supabase-js"
import flatpickr from "flatpickr" // Import flatpickr

// Supabase configuration
const supabaseUrl = "https://your-supabase-url.supabase.co" // Replace with your Supabase URL
const supabaseKey = "your-supabase-api-key" // Replace with your Supabase API key
const supabaseClient = createClient(supabaseUrl, supabaseKey)

// Add this near the top of your planner.js file, after other variable declarations
let optimizeRouteEnabled = false
let selectedDestinations = [] // Declare selectedDestinations
const routeOptimizer = {
  optimizeRoute: async (destinations) => {
    // Mock implementation for route optimization
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
    const optimizedDestinations = [...destinations]
    // Basic shuffle for demonstration
    for (let i = optimizedDestinations.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[optimizedDestinations[i], optimizedDestinations[j]] = [optimizedDestinations[j], optimizedDestinations[i]]
    }
    return { optimizedDestinations }
  },
  calculateRouteStats: (directions) => {
    // Mock implementation for route statistics
    return {
      formattedDistance: "Approx. 100 km",
      formattedDuration: "Approx. 2 hours",
    }
  },
} // Declare routeOptimizer
const updateMapWithDestinations = (destinations) => {
  console.log("Updating map with destinations:", destinations)
} // Declare updateMapWithDestinations

document.addEventListener("DOMContentLoaded", async () => {
  // DOM Elements
  var tabButtons = document.querySelectorAll(".tab-btn")
  var tabPanes = document.querySelectorAll(".tab-pane")
  var prevButton = document.getElementById("prev-btn")
  var nextButton = document.getElementById("next-btn")
  var saveButton = document.getElementById("save-btn")
  var shareButton = document.getElementById("share-btn")
  var currentTabIndex = 0

  // Check if user is logged in
  const {
    data: { session },
  } = await supabaseClient.auth.getSession()
  const isLoggedIn = !!session

  // Trip data object - simple JS object instead of TypeScript interface
  var tripData = {
    id: null, // Will be set if editing an existing itinerary
    user_id: isLoggedIn ? session.user.id : null,
    title: "My Trip to India",
    destinations: [],
    start_date: null,
    end_date: null,
    travelers: "2",
    budget: "medium",
    activities: [],
    accommodation: "hotel",
    transportation: "public",
    itinerary_data: {
      days: [],
    },
  }

  // Check if we're editing an existing itinerary
  const urlParams = new URLSearchParams(window.location.search)
  const editItineraryId = urlParams.get("edit")

  if (editItineraryId && isLoggedIn) {
    // Fetch the itinerary data
    await loadItinerary(editItineraryId)
  }

  // Initialize date picker if element exists
  var datePickerElement = document.getElementById("date-picker")
  if (datePickerElement && typeof flatpickr === "function") {
    var datePicker = flatpickr("#date-picker", {
      mode: "range",
      minDate: "today",
      dateFormat: "Y-m-d",
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          tripData.start_date = selectedDates[0]
          tripData.end_date = selectedDates[1]

          // Update trip summary with plain JS
          var startDateEl = document.getElementById("start-date")
          var endDateEl = document.getElementById("end-date")
          var durationEl = document.getElementById("trip-duration")

          if (startDateEl) startDateEl.textContent = formatDate(selectedDates[0])
          if (endDateEl) endDateEl.textContent = formatDate(selectedDates[1])

          // Calculate trip duration
          var diffTime = Math.abs(selectedDates[1] - selectedDates[0])
          var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
          if (durationEl) durationEl.textContent = diffDays + " " + (diffDays === 1 ? "day" : "days")

          // Generate itinerary days
          generateItineraryDays(diffDays)
        }
      },
    })

    // If editing and we have dates, set them
    if (tripData.start_date && tripData.end_date) {
      datePicker.setDate([new Date(tripData.start_date), new Date(tripData.end_date)])
    }
  }

  // Helper function to format date
  function formatDate(date) {
    var options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  // Tab switching function
  function switchTab(index) {
    // Hide all tabs
    for (var i = 0; i < tabButtons.length; i++) {
      tabButtons[i].classList.remove("active")
      tabPanes[i].classList.remove("active")
    }

    // Show selected tab
    tabButtons[index].classList.add("active")
    tabPanes[index].classList.add("active")

    // Update navigation buttons
    if (prevButton) prevButton.disabled = index === 0
    if (nextButton) nextButton.disabled = index === tabButtons.length - 1

    // Show/hide save and share buttons on last tab
    if (index === tabButtons.length - 1) {
      if (saveButton) saveButton.style.display = "block"
      if (shareButton) shareButton.style.display = "block"
    } else {
      if (saveButton) saveButton.style.display = "none"
      if (shareButton) shareButton.style.display = "none"
    }

    currentTabIndex = index
  }

  // Add click event to tab buttons
  for (var i = 0; i < tabButtons.length; i++) {
    ;((index) => {
      tabButtons[index].addEventListener("click", () => {
        switchTab(index)
      })
    })(i)
  }

  // Previous button click
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      if (currentTabIndex > 0) {
        switchTab(currentTabIndex - 1)
      }
    })
  }

  // Next button click
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (currentTabIndex < tabButtons.length - 1) {
        switchTab(currentTabIndex + 1)
      }
    })
  }

  // Destinations Tab Functionality
  var destinationSearch = document.getElementById("destination-search")
  var selectedDestinationsElement = document.getElementById("selected-destinations")
  var destinationOptions = document.querySelectorAll(".destination-option")

  // Add click event to destination options
  for (var i = 0; i < destinationOptions.length; i++) {
    destinationOptions[i].addEventListener("click", function () {
      var destination = this.getAttribute("data-destination")
      addDestination(destination)
    })
  }

  // Function to add a destination
  function addDestination(destination) {
    if (!selectedDestinationsElement) return

    // Check if destination already exists
    var existingDestinations = []
    var badges = selectedDestinationsElement.children

    for (var i = 0; i < badges.length; i++) {
      existingDestinations.push(badges[i].getAttribute("data-destination"))
    }

    if (existingDestinations.indexOf(destination) === -1) {
      // Create destination badge
      var badge = document.createElement("div")
      badge.className = "destination-badge"
      badge.setAttribute("data-destination", destination)
      badge.innerHTML = destination + '<span class="remove-destination">' + '<i class="fas fa-times"></i>' + "</span>"

      // Add click event to remove button
      badge.querySelector(".remove-destination").addEventListener("click", () => {
        badge.remove()

        // Update trip data
        var index = tripData.destinations.indexOf(destination)
        if (index !== -1) {
          tripData.destinations.splice(index, 1)
        }
      })

      // Add badge to selected destinations
      selectedDestinationsElement.appendChild(badge)

      // Update trip data
      tripData.destinations.push(destination)
    }
  }

  // Preferences Tab Functionality
  var budgetRadios = document.querySelectorAll('input[name="budget"]')
  var activityCheckboxes = document.querySelectorAll('input[name="activities"]')
  var accommodationRadios = document.querySelectorAll('input[name="accommodation"]')
  var transportationRadios = document.querySelectorAll('input[name="transportation"]')

  // Add event listeners to budget radios
  for (var i = 0; i < budgetRadios.length; i++) {
    budgetRadios[i].addEventListener("change", function () {
      tripData.budget = this.value
    })
  }

  // Add event listeners to activity checkboxes
  for (var j = 0; j < activityCheckboxes.length; j++) {
    activityCheckboxes[j].addEventListener("change", function () {
      if (this.checked) {
        tripData.activities.push(this.value)
      } else {
        var index = tripData.activities.indexOf(this.value)
        if (index !== -1) {
          tripData.activities.splice(index, 1)
        }
      }
    })
  }

  // Add event listeners to accommodation radios
  for (var i = 0; i < accommodationRadios.length; i++) {
    accommodationRadios[i].addEventListener("change", function () {
      tripData.accommodation = this.value
    })
  }

  // Add event listeners to transportation radios
  for (var i = 0; i < transportationRadios.length; i++) {
    transportationRadios[i].addEventListener("change", function () {
      tripData.transportation = this.value
    })
  }

  // Map Toggle
  var toggleMapButton = document.getElementById("toggle-map")
  var mapContainer = document.getElementById("map-container")

  if (toggleMapButton && mapContainer) {
    toggleMapButton.addEventListener("click", () => {
      var isVisible = mapContainer.style.display !== "none"

      if (isVisible) {
        mapContainer.style.display = "none"
        toggleMapButton.innerHTML = '<i class="fas fa-map-marked-alt"></i> Show Map'
      } else {
        mapContainer.style.display = "block"
        toggleMapButton.innerHTML = '<i class="fas fa-map-marked-alt"></i> Hide Map'
        initMap()
      }
    })
  }

  // Simple map initialization function
  function initMap() {
    // This would be replaced with actual Google Maps initialization
    console.log("Map initialized")
  }

  // Itinerary Day Tabs
  var itineraryTabButtons = document.querySelectorAll(".itinerary-tab-btn")
  var itineraryDayContents = document.querySelectorAll(".itinerary-day-content")

  for (var k = 0; k < itineraryTabButtons.length; k++) {
    ;((index) => {
      itineraryTabButtons[index].addEventListener("click", function () {
        // Hide all day contents
        for (var j = 0; j < itineraryTabButtons.length; j++) {
          itineraryTabButtons[j].classList.remove("active")
          itineraryDayContents[j].classList.remove("active")
        }

        // Show selected day content
        this.classList.add("active")
        itineraryDayContents[index].classList.add("active")
      })
    })(k)
  }

  // Add Activity Button
  var addActivityButtons = document.querySelectorAll(".add-activity-btn")

  for (var i = 0; i < addActivityButtons.length; i++) {
    addActivityButtons[i].addEventListener("click", () => {
      showActivityModal()
    })
  }

  function showActivityModal() {
    alert("Add activity functionality would open a modal here")
    // In a real implementation, this would open a modal to add an activity
  }

  // Function to generate itinerary days
  function generateItineraryDays(numDays) {
    // Store the days in the trip data
    tripData.itinerary_data.days = []

    for (var i = 0; i < numDays; i++) {
      var day = {
        day: i + 1,
        date: new Date(tripData.start_date),
        activities: [],
      }

      // Add days to the start date
      day.date.setDate(day.date.getDate() + i)

      // Add some default activities based on the destination
      if (tripData.destinations.length > 0) {
        var destination = tripData.destinations[0]

        if (i === 0) {
          // First day activities
          day.activities.push({
            type: "arrival",
            title: "Arrival and Check-in",
            time: "12:00 PM",
            duration: "2 hours",
            location: "Hotel",
          })

          day.activities.push({
            type: "sightseeing",
            title: "Local Exploration",
            time: "3:00 PM",
            duration: "3 hours",
            location: "destination",
          })

          day.activities.push({
            type: "dining",
            title: "Welcome Dinner",
            time: "7:00 PM",
            duration: "2 hours",
            location: "Local Restaurant",
          })
        } else if (i === numDays - 1) {
          // Last day activities
          day.activities.push({
            type: "breakfast",
            title: "Breakfast",
            time: "8:00 AM",
            duration: "1 hour",
            location: "Hotel",
          })

          day.activities.push({
            type: "shopping",
            title: "Souvenir Shopping",
            time: "10:00 AM",
            duration: "2 hours",
            location: "Local Market",
          })

          day.activities.push({
            type: "departure",
            title: "Check-out and Departure",
            time: "12:00 PM",
            duration: "2 hours",
            location: "Hotel",
          })
        } else {
          // Middle day activities
          day.activities.push({
            type: "breakfast",
            title: "Breakfast",
            time: "8:00 AM",
            duration: "1 hour",
            location: "Hotel",
          })

          day.activities.push({
            type: "sightseeing",
            title: "Sightseeing Tour",
            time: "10:00 AM",
            duration: "4 hours",
            location: "destination",
          })

          day.activities.push({
            type: "dining",
            title: "Lunch",
            time: "2:00 PM",
            duration: "1 hour",
            location: "Local Restaurant",
          })

          day.activities.push({
            type: "leisure",
            title: "Free Time / Rest",
            time: "3:00 PM",
            duration: "2 hours",
            location: "Hotel",
          })

          day.activities.push({
            type: "cultural",
            title: "Cultural Experience",
            time: "5:00 PM",
            duration: "2 hours",
            location: "destination",
          })

          day.activities.push({
            type: "dining",
            title: "Dinner",
            time: "7:00 PM",
            duration: "2 hours",
            location: "Local Restaurant",
          })
        }
      }

      tripData.itinerary_data.days.push(day)
    }

    // Update the UI to show the days
    updateItineraryUI()
  }

  // Function to update the itinerary UI
  function updateItineraryUI() {
    // Get the itinerary tabs container
    var itineraryTabs = document.querySelector(".itinerary-tabs")
    if (!itineraryTabs) return

    // Clear existing tabs
    itineraryTabs.innerHTML = ""

    // Get the container for day content
    var itineraryTabContent = document.querySelector(".tab-pane#itinerary-tab .tab-pane-content")
    if (!itineraryTabContent) return

    // Remove existing day content
    var existingDayContent = itineraryTabContent.querySelectorAll(".itinerary-day-content")
    existingDayContent.forEach((content) => {
      content.remove()
    })

    // Create tabs and content for each day
    tripData.itinerary_data.days.forEach((day, index) => {
      // Create tab button
      var tabButton = document.createElement("button")
      tabButton.className = "itinerary-tab-btn" + (index === 0 ? " active" : "")
      tabButton.setAttribute("data-day", "day-" + (index + 1))
      tabButton.textContent = "Day " + (index + 1)

      // Add click event
      tabButton.addEventListener("click", function () {
        // Hide all day contents
        var allDayContents = document.querySelectorAll(".itinerary-day-content")
        var allTabButtons = document.querySelectorAll(".itinerary-tab-btn")

        allDayContents.forEach((content) => {
          content.classList.remove("active")
        })

        allTabButtons.forEach((btn) => {
          btn.classList.remove("active")
        })

        // Show selected day content
        document.getElementById("day-" + (index + 1) + "-content").classList.add("active")
        this.classList.add("active")
      })

      itineraryTabs.appendChild(tabButton)

      // Create day content
      var dayContent = document.createElement("div")
      dayContent.className = "itinerary-day-content" + (index === 0 ? " active" : "")
      dayContent.id = "day-" + (index + 1) + "-content"

      // Format date
      var formattedDate = day.date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      // Get destination for this day
      var dayDestination = tripData.destinations.length > 0 ? tripData.destinations[0] : "Your destination"

      // Create day header
      var dayHeader = document.createElement("div")
      dayHeader.className = "day-header"
      dayHeader.innerHTML = `
        <div>
          <h3>${formattedDate}</h3>
          <p class="day-location"><i class="fas fa-map-marker-alt"></i> ${dayDestination}</p>
        </div>
        <div class="day-weather">
          <i class="fas fa-sun"></i>
          <span>32°C</span>
        </div>
      `

      dayContent.appendChild(dayHeader)

      // Create activities container
      var activitiesContainer = document.createElement("div")
      activitiesContainer.className = "day-activities"

      // Add activities
      day.activities.forEach((activity) => {
        var activityItem = document.createElement("div")
        activityItem.className = "activity-item"

        // Choose icon based on activity type
        var icon = "calendar"
        switch (activity.type) {
          case "arrival":
          case "departure":
            icon = "plane"
            break
          case "breakfast":
          case "dining":
            icon = "utensils"
            break
          case "sightseeing":
            icon = "camera"
            break
          case "cultural":
            icon = "landmark"
            break
          case "shopping":
            icon = "shopping-bag"
            break
          case "leisure":
            icon = "umbrella-beach"
            break
        }

        activityItem.innerHTML = `
          <div class="activity-icon">
            <i class="fas fa-${icon}"></i>
          </div>
          <div class="activity-details">
            <h4>${activity.title}</h4>
            <div class="activity-meta">
              <span><i class="fas fa-clock"></i> ${activity.time} (${activity.duration})</span>
              <span><i class="fas fa-map-marker-alt"></i> ${activity.location}</span>
            </div>
          </div>
          <div class="activity-actions">
            <button class="activity-btn" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="activity-btn" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        `

        activitiesContainer.appendChild(activityItem)
      })

      dayContent.appendChild(activitiesContainer)

      // Add "Add Activity" button
      var addActivityBtn = document.createElement("button")
      addActivityBtn.className = "btn btn-outline add-activity-btn"
      addActivityBtn.innerHTML = '<i class="fas fa-plus"></i> Add Activity'
      addActivityBtn.addEventListener("click", showActivityModal)

      dayContent.appendChild(addActivityBtn)

      // Add day content to the page
      itineraryTabContent.appendChild(dayContent)
    })
  }

  // Save and Share functionality
  if (saveButton) {
    saveButton.addEventListener("click", async () => {
      if (!isLoggedIn) {
        alert("Please log in to save your itinerary")
        window.location.href = "login.html"
        return
      }

      try {
        // Prepare data for saving
        const itineraryData = {
          user_id: tripData.user_id,
          title: tripData.title || "My Trip to India",
          destinations: tripData.destinations,
          start_date: tripData.start_date,
          end_date: tripData.end_date,
          travelers: tripData.travelers,
          budget: tripData.budget,
          activities: tripData.activities,
          accommodation: tripData.accommodation,
          transportation: tripData.transportation,
          itinerary_data: tripData.itinerary_data,
        }

        let result

        if (tripData.id) {
          // Update existing itinerary
          result = await supabaseClient.from("itineraries").update(itineraryData).eq("id", tripData.id).select()

          if (result.error) {
            throw result.error
          }

          alert("Your itinerary has been updated successfully!")
        } else {
          // Create new itinerary
          result = await supabaseClient.from("itineraries").insert([itineraryData]).select()

          if (result.error) {
            throw result.error
          }

          // Update tripData with the new ID
          tripData.id = result.data[0].id

          alert("Your itinerary has been saved successfully!")
        }

        // Redirect to itineraries page
        window.location.href = "itineraries.html"
      } catch (error) {
        console.error("Error saving itinerary:", error)
        alert("There was an error saving your itinerary. Please try again.")
      }
    })
  }

  if (shareButton) {
    shareButton.addEventListener("click", () => {
      // Generate a shareable link
      var shareLink = window.location.origin + "/share.html?trip=" + btoa(JSON.stringify(tripData))

      // Copy to clipboard
      var tempInput = document.createElement("input")
      document.body.appendChild(tempInput)
      tempInput.value = shareLink
      tempInput.select()
      document.execCommand("copy")
      document.body.removeChild(tempInput)

      alert("Share link has been copied to clipboard!")
    })
  }

  // Function to load an existing itinerary for editing
  async function loadItinerary(itineraryId) {
    try {
      const { data, error } = await supabaseClient.from("itineraries").select("*").eq("id", itineraryId).single()

      if (error) {
        throw error
      }

      if (!data) {
        alert("Itinerary not found")
        return
      }

      // Update tripData with the loaded data
      tripData.id = data.id
      tripData.user_id = data.user_id
      tripData.title = data.title
      tripData.destinations = data.destinations
      tripData.start_date = data.start_date
      tripData.end_date = data.end_date
      tripData.travelers = data.travelers
      tripData.budget = data.budget
      tripData.activities = data.activities
      tripData.accommodation = data.accommodation
      tripData.transportation = data.transportation
      tripData.itinerary_data = data.itinerary_data

      // Update UI with loaded data

      // Populate destinations
      if (Array.isArray(tripData.destinations)) {
        tripData.destinations.forEach((destination) => {
          addDestination(destination)
        })
      }

      // Set budget radio
      if (tripData.budget) {
        const budgetRadio = document.querySelector(`input[name="budget"][value="${tripData.budget}"]`)
        if (budgetRadio) {
          budgetRadio.checked = true
        }
      }

      // Set activities checkboxes
      if (Array.isArray(tripData.activities)) {
        tripData.activities.forEach((activity) => {
          const activityCheckbox = document.querySelector(`input[name="activities"][value="${activity}"]`)
          if (activityCheckbox) {
            activityCheckbox.checked = true
          }
        })
      }

      // Set accommodation radio
      if (tripData.accommodation) {
        const accommodationRadio = document.querySelector(
          `input[name="accommodation"][value="${tripData.accommodation}"]`,
        )
        if (accommodationRadio) {
          accommodationRadio.checked = true
        }
      }

      // Set transportation radio
      if (tripData.transportation) {
        const transportationRadio = document.querySelector(
          `input[name="transportation"][value="${tripData.transportation}"]`,
        )
        if (transportationRadio) {
          transportationRadio.checked = true
        }
      }

      // Update itinerary UI
      if (tripData.itinerary_data && tripData.itinerary_data.days) {
        updateItineraryUI()
      }
    } catch (error) {
      console.error("Error loading itinerary:", error)
      alert("There was an error loading the itinerary. Please try again.")
    }
  }
})

// Add this function to your planner.js file
function toggleRouteOptimization() {
  optimizeRouteEnabled = !optimizeRouteEnabled
  const toggleButton = document.getElementById("optimize-route-toggle")
  if (toggleButton) {
    toggleButton.textContent = optimizeRouteEnabled ? "Disable Route Optimization" : "Enable Route Optimization"
    toggleButton.classList.toggle("active", optimizeRouteEnabled)
  }

  // If optimization is enabled and we have destinations, optimize the route
  if (optimizeRouteEnabled && selectedDestinations.length > 1) {
    optimizeCurrentRoute()
  }
}

// Add this function to optimize the current route
async function optimizeCurrentRoute() {
  if (selectedDestinations.length < 2) {
    showNotification("Add at least two destinations to optimize the route", "warning")
    return
  }

  try {
    showLoadingIndicator("Optimizing route...")

    // Extract destination names for optimization
    const destinationNames = selectedDestinations.map((dest) => dest.name + ", India")

    // Optimize the route
    const result = await routeOptimizer.optimizeRoute(destinationNames)

    // Reorder the selected destinations based on the optimized route
    const optimizedDestinations = []
    const optimizedNames = result.optimizedDestinations

    for (let i = 0; i < optimizedNames.length; i++) {
      // Find the original destination object that matches this name
      const optimizedName = optimizedNames[i].replace(", India", "")
      const originalDest = selectedDestinations.find((dest) => dest.name === optimizedName)
      if (originalDest) {
        optimizedDestinations.push(originalDest)
      }
    }

    // Update the selected destinations with the optimized order
    selectedDestinations = optimizedDestinations

    // Update the UI to reflect the new order
    updateDestinationsList()

    // If we have a map view, update it
    if (typeof updateMapWithDestinations === "function") {
      updateMapWithDestinations(selectedDestinations)
    }

    // Calculate and display route statistics
    const stats = routeOptimizer.calculateRouteStats(result.directions)
    showNotification(
      `Route optimized! Total distance: ${stats.formattedDistance}, Duration: ${stats.formattedDuration}`,
      "success",
    )

    // Update the itinerary if it exists
    if (startDate && endDate) {
      generateItinerary()
    }

    hideLoadingIndicator()
  } catch (error) {
    hideLoadingIndicator()
    showNotification("Failed to optimize route: " + error.message, "error")
    console.error("Route optimization error:", error)
  }
}

// Add this function to show loading indicator
function showLoadingIndicator(message = "Loading...") {
  // Check if loading indicator already exists
  let loadingIndicator = document.getElementById("loading-indicator")

  if (!loadingIndicator) {
    // Create loading indicator if it doesn't exist
    loadingIndicator = document.createElement("div")
    loadingIndicator.id = "loading-indicator"
    loadingIndicator.className = "loading-indicator"

    const spinner = document.createElement("div")
    spinner.className = "spinner"

    const messageElement = document.createElement("p")
    messageElement.id = "loading-message"

    loadingIndicator.appendChild(spinner)
    loadingIndicator.appendChild(messageElement)
    document.body.appendChild(loadingIndicator)
  }

  // Update message and show
  document.getElementById("loading-message").textContent = message
  loadingIndicator.style.display = "flex"
}

// Add this function to hide loading indicator
function hideLoadingIndicator() {
  const loadingIndicator = document.getElementById("loading-indicator")
  if (loadingIndicator) {
    loadingIndicator.style.display = "none"
  }
}

// Add this function to show notifications
function showNotification(message, type = "info") {
  // Check if notification container exists
  let notificationContainer = document.getElementById("notification-container")

  if (!notificationContainer) {
    // Create notification container if it doesn't exist
    notificationContainer = document.createElement("div")
    notificationContainer.id = "notification-container"
    document.body.appendChild(notificationContainer)
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Add close button
  const closeButton = document.createElement("button")
  closeButton.className = "notification-close"
  closeButton.innerHTML = "&times;"
  closeButton.onclick = () => {
    notification.remove()
  }

  notification.appendChild(closeButton)
  notificationContainer.appendChild(notification)

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove()
  }, 5000)
}

// Modify the updateDestinationsList function to include a reordering UI
let startDate
let endDate
let generateItinerary
let removeDestination

function updateDestinationsList() {
  const destinationsList = document.getElementById("selected-destinations")
  if (!destinationsList) return

  destinationsList.innerHTML = ""

  if (selectedDestinations.length === 0) {
    const emptyMessage = document.createElement("div")
    emptyMessage.className = "empty-message"
    emptyMessage.textContent = "No destinations selected. Add destinations from the search above."
    destinationsList.appendChild(emptyMessage)
    return
  }

  selectedDestinations.forEach((destination, index) => {
    const destinationItem = document.createElement("div")
    destinationItem.className = "destination-item"

    // Add drag handle for manual reordering
    const dragHandle = document.createElement("div")
    dragHandle.className = "drag-handle"
    dragHandle.innerHTML = "&#8942;&#8942;" // Unicode for vertical dots

    const destinationInfo = document.createElement("div")
    destinationInfo.className = "destination-info"

    const destinationName = document.createElement("div")
    destinationName.className = "destination-name"
    destinationName.textContent = destination.name

    const destinationActions = document.createElement("div")
    destinationActions.className = "destination-actions"

    const removeButton = document.createElement("button")
    removeButton.className = "remove-destination"
    removeButton.innerHTML = "&times;"
    removeButton.setAttribute("aria-label", "Remove destination")
    removeButton.onclick = () => {
      removeDestinationItem(index)
    }

    // Add up/down buttons for reordering
    const upButton = document.createElement("button")
    upButton.className = "move-destination up"
    upButton.innerHTML = "&#9650;" // Unicode for up arrow
    upButton.setAttribute("aria-label", "Move destination up")
    upButton.disabled = index === 0
    upButton.onclick = () => {
      moveDestination(index, index - 1)
    }

    const downButton = document.createElement("button")
    downButton.className = "move-destination down"
    downButton.innerHTML = "&#9660;" // Unicode for down arrow
    downButton.setAttribute("aria-label", "Move destination down")
    downButton.disabled = index === selectedDestinations.length - 1
    downButton.onclick = () => {
      moveDestination(index, index + 1)
    }

    destinationInfo.appendChild(destinationName)

    if (destination.description) {
      const destinationDesc = document.createElement("div")
      destinationDesc.className = "destination-description"
      destinationDesc.textContent = destination.description
      destinationInfo.appendChild(destinationDesc)
    }

    destinationActions.appendChild(upButton)
    destinationActions.appendChild(downButton)
    destinationActions.appendChild(removeButton)

    destinationItem.appendChild(dragHandle)
    destinationItem.appendChild(destinationInfo)
    destinationItem.appendChild(destinationActions)

    destinationsList.appendChild(destinationItem)
  })

  // Add optimize route button if we have more than one destination
  if (selectedDestinations.length > 1) {
    const optimizeButtonContainer = document.createElement("div")
    optimizeButtonContainer.className = "optimize-button-container"

    const optimizeButton = document.createElement("button")
    optimizeButton.id = "optimize-route-toggle"
    optimizeButton.className = "optimize-route-button"
    optimizeButton.textContent = optimizeRouteEnabled ? "Disable Route Optimization" : "Enable Route Optimization"
    if (optimizeRouteEnabled) {
      optimizeButton.classList.add("active")
    }
    optimizeButton.onclick = toggleRouteOptimization

    optimizeButtonContainer.appendChild(optimizeButton)
    destinationsList.appendChild(optimizeButtonContainer)
  }
}

// Add this function to move a destination in the list
function moveDestination(fromIndex, toIndex) {
  if (
    fromIndex < 0 ||
    fromIndex >= selectedDestinations.length ||
    toIndex < 0 ||
    toIndex >= selectedDestinations.length
  ) {
    return
  }

  const destination = selectedDestinations[fromIndex]
  selectedDestinations.splice(fromIndex, 1)
  selectedDestinations.splice(toIndex, 0, destination)

  updateDestinationsList()

  // If we have a map view, update it
  if (typeof updateMapWithDestinations === "function") {
    updateMapWithDestinations(selectedDestinations)
  }

  // Update the itinerary if it exists
  if (startDate && endDate) {
    generateItinerary()
  }
}

function removeDestinationItem(index) {
  selectedDestinations.splice(index, 1)
  updateDestinationsList()

  // If we have a map view, update it
  if (typeof updateMapWithDestinations === "function") {
    updateMapWithDestinations(selectedDestinations)
  }

  // Update the itinerary if it exists
  if (startDate && endDate) {
    generateItinerary()
  }
}
