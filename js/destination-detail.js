// Destination Detail JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  var tabButtons = document.querySelectorAll(".tab-button")
  var tabContents = document.querySelectorAll(".tab-content")

  // Get destination ID from URL
  var urlParams = new URLSearchParams(window.location.search)
  var destinationId = urlParams.get("id") || "1" // Default to 1 if not specified

  // Load destination data
  loadDestinationData(destinationId)

  // Tab functionality
  for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener("click", function () {
      // Get tab ID
      var tabId = this.getAttribute("data-tab")

      // Remove active class from all tabs
      for (var j = 0; j < tabButtons.length; j++) {
        tabButtons[j].classList.remove("active")
        tabContents[j].classList.remove("active")
      }

      // Add active class to clicked tab
      this.classList.add("active")
      document.getElementById(tabId + "-tab").classList.add("active")
    })
  }

  // Function to load destination data
  function loadDestinationData(id) {
    // In a real app, this would fetch data from an API
    // For this demo, we'll use hardcoded data
    var destinations = {
      1: {
        name: "Delhi",
        country: "India",
        image: "images/delhi.png",
        description:
          "Delhi, India's capital territory, is a massive metropolitan area in the country's north. In Old Delhi, a neighborhood dating to the 1600s, stands the imposing Mughal-era Red Fort, a symbol of India, and the sprawling Jama Masjid mosque, whose courtyard accommodates 25,000 people. Nearby is Chandni Chowk, a vibrant bazaar filled with food carts, sweets shops and spice stalls.",
        rating: 4.7,
        category: "city",
        season: "winter",
        bestTime: "October to March",
        temperature: "Summer: 25-45°C, Winter: 5-25°C",
        popularFor: ["Red Fort", "India Gate", "Qutub Minar"],
      },
      2: {
        name: "Jaipur",
        country: "India",
        image: "images/jaipur.png",
        description:
          "Jaipur is the capital of India's Rajasthan state. It evokes the royal family that once ruled the region and that, in 1727, founded what is now called the Old City, or 'Pink City' for its trademark building color. At the center of its stately street grid stands the opulent, colonnaded City Palace complex. With gardens, courtyards and museums, part of it is still a royal residence.",
        rating: 4.8,
        category: "cultural",
        season: "winter",
        bestTime: "October to March",
        temperature: "Summer: 25-40°C, Winter: 8-25°C",
        popularFor: ["Amber Fort", "City Palace", "Hawa Mahal"],
      },
      3: {
        name: "Goa",
        country: "India",
        image: "images/goa.png",
        description:
          "Goa is a state on the southwestern coast of India within the region known as the Konkan. It is bounded by the state of Maharashtra to the north and by Karnataka to the east and south, with the Arabian Sea forming its western coast. Known for its beaches, nightlife, and places of worship, Goa is visited by large numbers of international and domestic tourists each year.",
        rating: 4.9,
        category: "beach",
        season: "winter",
        bestTime: "November to February",
        temperature: "Summer: 25-35°C, Winter: 20-30°C",
        popularFor: ["Beaches", "Nightlife", "Portuguese Architecture"],
      },
    }

    // Get destination data
    var destination = destinations[id] || destinations["1"]

    // Update page with destination data
    document.getElementById("destination-img").src = destination.image
    document.getElementById("destination-name").textContent = destination.name
    document.getElementById("destination-country").textContent = destination.country
    document.getElementById("destination-rating").textContent = destination.rating
    document.getElementById("destination-long-description").textContent = destination.description
    document.getElementById("destination-best-time").textContent = destination.bestTime
    document.getElementById("destination-temperature").textContent = destination.temperature
    document.getElementById("destination-category").textContent = destination.category
    document.getElementById("destination-season").textContent = destination.season
    document.getElementById("destination-cta-name").textContent = destination.name

    // Update popular for badges
    var popularForContainer = document.getElementById("destination-popular-for")
    popularForContainer.innerHTML = ""

    for (var i = 0; i < destination.popularFor.length; i++) {
      var badge = document.createElement("div")
      badge.className = "info-badge secondary"
      badge.textContent = destination.popularFor[i]
      popularForContainer.appendChild(badge)
    }

    // Update page title
    document.title = destination.name + " - Indian Travel Planner"

    // Initialize map (simplified for demo)
    initMap(destination.name + ", " + destination.country)
  }

  // Function to initialize map
  function initMap(location) {
    // In a real app, this would initialize Google Maps
    console.log("Initializing map for location:", location)

    // For demo purposes, we'll just update the placeholder text
    var mapPlaceholder = document.querySelector(".map-placeholder")
    if (mapPlaceholder) {
      mapPlaceholder.innerHTML = '<i class="fas fa-map-marked-alt"></i><p>Map for ' + location + "</p>"
    }
  }
})
