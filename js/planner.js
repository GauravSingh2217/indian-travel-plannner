document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  var tabButtons = document.querySelectorAll(".tab-btn")
  var tabPanes = document.querySelectorAll(".tab-pane")
  var prevButton = document.getElementById("prev-btn")
  var nextButton = document.getElementById("next-btn")
  var saveButton = document.getElementById("save-btn")
  var shareButton = document.getElementById("share-btn")
  var currentTabIndex = 0

  // Trip data object - simple JS object instead of TypeScript interface
  var tripData = {
    destinations: [],
    startDate: null,
    endDate: null,
    travelers: "2",
    budget: "medium",
    activities: [],
    accommodation: "hotel",
    transportation: "public",
  }

  // Initialize date picker if element exists
  var datePickerElement = document.getElementById("date-picker")
  if (datePickerElement) {
    var datePicker = flatpickr("#date-picker", {
      mode: "range",
      minDate: "today",
      dateFormat: "Y-m-d",
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          tripData.startDate = selectedDates[0]
          tripData.endDate = selectedDates[1]

          // Update trip summary with plain JS
          var startDateEl = document.getElementById("start-date")
          var endDateEl = document.getElementById("end-date")
          var durationEl = document.getElementById("trip-duration")

          startDateEl.textContent = formatDate(selectedDates[0])
          endDateEl.textContent = formatDate(selectedDates[1])

          // Calculate trip duration
          var diffTime = Math.abs(selectedDates[1] - selectedDates[0])
          var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
          durationEl.textContent = diffDays + " " + (diffDays === 1 ? "day" : "days")
        }
      },
    })
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
  for (var i = 0; i < tabButtons.length; i++) {
    ;((index) => {
      tabButtons[index].addEventListener("click", () => {
        switchTab(index)
      })
    })(i)
  }

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
  var destinationSearch = document.getElementById("destination-search")
  var selectedDestinations = document.getElementById("selected-destinations")
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
    // Check if destination already exists
    var existingDestinations = []
    var badges = selectedDestinations.children

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
      selectedDestinations.appendChild(badge)

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
  for (var i = 0; i < activityCheckboxes.length; i++) {
    activityCheckboxes[i].addEventListener("change", function () {
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

  // Save and Share functionality
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      // Save trip data to localStorage
      localStorage.setItem("savedTrip", JSON.stringify(tripData))
      alert("Your trip has been saved successfully!")
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

  // Load saved trip data if available
  var savedTrip = localStorage.getItem("savedTrip")
  if (savedTrip) {
    try {
      var savedTripData = JSON.parse(savedTrip)

      // Restore saved data
      tripData = savedTripData

      // Populate UI with saved data
      if (savedTripData.destinations) {
        savedTripData.destinations.forEach((destination) => {
          addDestination(destination)
        })
      }

      // More restoration logic would go here
    } catch (e) {
      console.error("Error loading saved trip:", e)
    }
  }
})
