import { supabaseClient } from "./supabaseClient.js"

document.addEventListener("DOMContentLoaded", async () => {
  // DOM Elements
  const authCheckMessage = document.getElementById("auth-check-message")
  const loadingIndicator = document.getElementById("loading-indicator")
  const itinerariesList = document.getElementById("itineraries-list")
  const emptyState = document.getElementById("empty-state")

  // Check if user is logged in
  const {
    data: { session },
  } = await supabaseClient.auth.getSession()

  if (!session) {
    // User is not logged in, show auth check message
    if (authCheckMessage) authCheckMessage.style.display = "block"
    if (loadingIndicator) loadingIndicator.style.display = "none"
    return
  }

  // User is logged in, fetch their itineraries
  try {
    const userId = session.user.id

    // Fetch itineraries from Supabase
    const { data: itineraries, error } = await supabaseClient
      .from("itineraries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    // Hide loading indicator
    if (loadingIndicator) loadingIndicator.style.display = "none"

    if (!itineraries || itineraries.length === 0) {
      // No itineraries found, show empty state
      if (emptyState) emptyState.style.display = "block"
      return
    }

    // Display itineraries
    if (itinerariesList) {
      itinerariesList.style.display = "grid"
      renderItineraries(itineraries)
    }
  } catch (error) {
    console.error("Error fetching itineraries:", error)
    if (loadingIndicator) loadingIndicator.style.display = "none"

    // Show error message
    if (itinerariesList) {
      itinerariesList.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <p>There was an error loading your itineraries. Please try again later.</p>
        </div>
      `
      itinerariesList.style.display = "block"
    }
  }

  // Function to render itineraries
  function renderItineraries(itineraries) {
    itinerariesList.innerHTML = ""

    itineraries.forEach((itinerary) => {
      // Parse JSON data
      const destinations =
        typeof itinerary.destinations === "string" ? JSON.parse(itinerary.destinations) : itinerary.destinations

      const startDate = itinerary.start_date ? new Date(itinerary.start_date) : null
      const endDate = itinerary.end_date ? new Date(itinerary.end_date) : null

      // Format dates
      const formattedStartDate = startDate
        ? startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Not specified"

      const formattedEndDate = endDate
        ? endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Not specified"

      // Calculate duration
      let duration = "Not specified"
      if (startDate && endDate) {
        const diffTime = Math.abs(endDate - startDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        duration = `${diffDays} ${diffDays === 1 ? "day" : "days"}`
      }

      // Get primary destination for card image
      const primaryDestination =
        Array.isArray(destinations) && destinations.length > 0 ? destinations[0] : "Unknown destination"

      // Get image based on destination
      let destinationImage = "images/india-hero.png" // Default image

      if (primaryDestination.includes("Delhi")) {
        destinationImage = "images/delhi.png"
      } else if (primaryDestination.includes("Mumbai")) {
        destinationImage = "images/mumbai.png"
      } else if (primaryDestination.includes("Jaipur")) {
        destinationImage = "images/jaipur.png"
      } else if (primaryDestination.includes("Goa")) {
        destinationImage = "images/goa.png"
      } else if (primaryDestination.includes("Varanasi")) {
        destinationImage = "images/varanasi.png"
      } else if (primaryDestination.includes("Agra")) {
        destinationImage = "images/agra.png"
      }

      // Create itinerary card
      const itineraryCard = document.createElement("div")
      itineraryCard.className = "itinerary-card"
      itineraryCard.innerHTML = `
        <div class="itinerary-image">
          <img src="${destinationImage}" alt="${primaryDestination}">
        </div>
        <div class="itinerary-content">
          <h3>${itinerary.title || "Untitled Itinerary"}</h3>
          <div class="itinerary-details">
            <div class="itinerary-detail">
              <i class="fas fa-map-marker-alt"></i>
              <span>${Array.isArray(destinations) ? destinations.join(", ") : "No destinations"}</span>
            </div>
            <div class="itinerary-detail">
              <i class="fas fa-calendar"></i>
              <span>${formattedStartDate} - ${formattedEndDate}</span>
            </div>
            <div class="itinerary-detail">
              <i class="fas fa-clock"></i>
              <span>${duration}</span>
            </div>
          </div>
        </div>
        <div class="itinerary-actions">
          <button class="btn btn-outline view-btn" data-id="${itinerary.id}">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="btn btn-outline edit-btn" data-id="${itinerary.id}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-outline delete-btn" data-id="${itinerary.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `

      // Add event listeners
      const viewBtn = itineraryCard.querySelector(".view-btn")
      const editBtn = itineraryCard.querySelector(".edit-btn")
      const deleteBtn = itineraryCard.querySelector(".delete-btn")

      viewBtn.addEventListener("click", () => {
        window.location.href = `itinerary-detail.html?id=${itinerary.id}`
      })

      editBtn.addEventListener("click", () => {
        window.location.href = `planner.html?edit=${itinerary.id}`
      })

      deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this itinerary? This action cannot be undone.")) {
          deleteItinerary(itinerary.id)
        }
      })

      // Add card to list
      itinerariesList.appendChild(itineraryCard)
    })
  }

  // Function to delete an itinerary
  async function deleteItinerary(itineraryId) {
    try {
      const { error } = await supabaseClient.from("itineraries").delete().eq("id", itineraryId)

      if (error) {
        throw error
      }

      // Remove the card from the UI
      const cardToRemove = document
        .querySelector(`.itinerary-card .delete-btn[data-id="${itineraryId}"]`)
        .closest(".itinerary-card")

      if (cardToRemove) {
        cardToRemove.remove()
      }

      // Check if there are any itineraries left
      if (itinerariesList && itinerariesList.children.length === 0) {
        itinerariesList.style.display = "none"
        if (emptyState) emptyState.style.display = "block"
      }

      alert("Itinerary deleted successfully")
    } catch (error) {
      console.error("Error deleting itinerary:", error)
      alert("Error deleting itinerary. Please try again.")
    }
  }

  // Check if there are saved itineraries
  var savedTrip = localStorage.getItem("savedTrip")
  var noItineraries = document.getElementById("no-itineraries")

  // If there are no saved itineraries and no demo itineraries, show the no itineraries message
  if (!savedTrip && itinerariesList.children.length <= 1) {
    // Hide all itinerary cards
    var itineraryCards = document.querySelectorAll(".itinerary-card")
    for (let j = 0; j < itineraryCards.length; j++) {
      itineraryCards[j].style.display = "none"
    }

    // Show no itineraries message
    noItineraries.style.display = "block"
  }

  // Add event listeners to share buttons
  var shareButtons = document.querySelectorAll(".itinerary-actions button:nth-child(2)")
  for (let k = 0; k < shareButtons.length; k++) {
    shareButtons[k].addEventListener("click", function () {
      // Generate a shareable link
      var shareLink =
        window.location.origin + "/share.html?id=" + this.closest(".itinerary-card").getAttribute("data-id")

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

  // Add event listeners to export buttons
  var exportButtons = document.querySelectorAll(".itinerary-actions button:nth-child(3)")
  for (let l = 0; l < exportButtons.length; l++) {
    exportButtons[l].addEventListener("click", () => {
      alert("Itinerary exported successfully!")
    })
  }
})
