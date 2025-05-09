// Itineraries page JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Check if there are saved itineraries
  var savedTrip = localStorage.getItem("savedTrip")
  var itinerariesList = document.getElementById("itineraries-list")
  var noItineraries = document.getElementById("no-itineraries")

  // If there are no saved itineraries and no demo itineraries, show the no itineraries message
  if (!savedTrip && itinerariesList.children.length <= 1) {
    // Hide all itinerary cards
    var itineraryCards = document.querySelectorAll(".itinerary-card")
    for (var i = 0; i < itineraryCards.length; i++) {
      itineraryCards[i].style.display = "none"
    }

    // Show no itineraries message
    noItineraries.style.display = "block"
  }

  // Add event listeners to share buttons
  var shareButtons = document.querySelectorAll(".itinerary-actions button:nth-child(2)")
  for (var i = 0; i < shareButtons.length; i++) {
    shareButtons[i].addEventListener("click", function () {
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
  for (var i = 0; i < exportButtons.length; i++) {
    exportButtons[i].addEventListener("click", () => {
      alert("Itinerary exported successfully!")
    })
  }
})
