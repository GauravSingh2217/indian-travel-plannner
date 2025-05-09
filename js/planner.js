document.addEventListener("DOMContentLoaded", () => {
  // Tab Navigation
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabPanes = document.querySelectorAll(".tab-pane")
  const prevButton = document.getElementById("prev-btn")
  const nextButton = document.getElementById("next-btn")
  const saveButton = document.getElementById("save-btn")
  const shareButton = document.getElementById("share-btn")

  let currentTabIndex = 0

  // Initialize Flatpickr date picker
  let datePicker // Declare datePicker variable
  if (document.getElementById("date-picker")) {
    datePicker = flatpickr("#date-picker", {
      mode: "range",
      minDate: "today",
      dateFormat: "Y-m-d",
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          const startDate = selectedDates[0]
          const endDate = selectedDates[1]

          // Update trip summary
          document.getElementById("start-date").textContent = startDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })

          document.getElementById("end-date").textContent = endDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })

          // Calculate trip duration
          const diffTime = Math.abs(endDate - startDate)
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
          document.getElementById("trip-duration").textContent = `${diffDays} ${diffDays === 1 ? "day" : "days"}`
        }
      },
    })
  }

  // Function to switch tabs
  function switchTab(index) {
    // Hide all tabs
    tabButtons.forEach((btn) => btn.classList.remove("active"))
    tabPanes.forEach((pane) => pane.classList.remove("active"))

    // Show selected tab
    tabButtons[index].classList.add("active")
    tabPanes[index].classList.add("active")

    // Update navigation buttons
    prevButton.disabled = index === 0
    nextButton.disabled = index === tabButtons.length - 1

    // Show/hide save and share buttons on last tab
    if (index === tabButtons.length - 1) {
      saveButton.style.display = "block"
      shareButton.style.display = "block"
    } else {
      saveButton.style.display = "none"
      shareButton.style.display = "none"
    }

    currentTabIndex = index
  }

  // Add click event to tab buttons
  tabButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      switchTab(index)
    })
  })

  // Previous button click
  prevButton.addEventListener("click", () => {
    if (currentTabIndex > 0) {
      switchTab(currentTabIndex - 1)
    }
  })

  // Next button click
  nextButton.addEventListener("click", () => {
    if (currentTabIndex < tabButtons.length - 1) {
      switchTab(currentTabIndex + 1)
    }
  })

  // Destinations Tab Functionality
  const destinationSearch = document.getElementById("destination-search")
  const selectedDestinations = document.getElementById("selected-destinations")
  const destinationOptions = document.querySelectorAll(".destination-option")

  if (destinationOptions.length > 0) {
    // Add click event to destination options
    destinationOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const destination = option.getAttribute("data-destination")
        addDestination(destination)
      })
    })
  }

  // Function to add a destination
  function addDestination(destination) {
    // Check if destination already exists
    const existingDestinations = Array.from(selectedDestinations.children).map((badge) =>
      badge.getAttribute("data-destination"),
    )

    if (!existingDestinations.includes(destination)) {
      // Create destination badge
      const badge = document.createElement("div")
      badge.className = "destination-badge"
      badge.setAttribute("data-destination", destination)
      badge.innerHTML = `
        ${destination}
        <span class="remove-destination">
          <i class="fas fa-times"></i>
        </span>
      `

      // Add click event to remove button
      badge.querySelector(".remove-destination").addEventListener("click", () => {
        badge.remove()
      })

      // Add badge to selected destinations
      selectedDestinations.appendChild(badge)
    }
  }

  // Map Toggle
  const toggleMapButton = document.getElementById("toggle-map")
  const mapContainer = document.getElementById("map-container")

  if (toggleMapButton && mapContainer) {
    toggleMapButton.addEventListener("click", () => {
      const isVisible = mapContainer.style.display !== "none"

      if (isVisible) {
        mapContainer.style.display = "none"
        toggleMapButton.innerHTML = '<i class="fas fa-map-marked-alt"></i> Show Map'
      } else {
        mapContainer.style.display = "block"
        toggleMapButton.innerHTML = '<i class="fas fa-map-marked-alt"></i> Hide Map'
      }
    })
  }

  // Itinerary Day Tabs
  const itineraryTabButtons = document.querySelectorAll(".itinerary-tab-btn")
  const itineraryDayContents = document.querySelectorAll(".itinerary-day-content")

  if (itineraryTabButtons.length > 0) {
    itineraryTabButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        // Hide all day contents
        itineraryTabButtons.forEach((b) => b.classList.remove("active"))
        itineraryDayContents.forEach((c) => c.classList.remove("active"))

        // Show selected day content
        btn.classList.add("active")
        itineraryDayContents[index].classList.add("active")
      })
    })
  }

  // Currency Toggle
  const currencyButtons = document.querySelectorAll(".currency-btn")

  if (currencyButtons.length > 0) {
    currencyButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        currencyButtons.forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")

        // In a real app, this would update the displayed currency
      })
    })
  }

  // Transportation Mode Toggle
  const transportButtons = document.querySelectorAll(".transport-btn")

  if (transportButtons.length > 0) {
    transportButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        transportButtons.forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")

        // In a real app, this would update the map route
      })
    })
  }

  // Save and Share functionality
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      alert("Your trip has been saved successfully!")
    })
  }

  if (shareButton) {
    shareButton.addEventListener("click", () => {
      alert("Share link has been copied to clipboard!")
    })
  }
})
