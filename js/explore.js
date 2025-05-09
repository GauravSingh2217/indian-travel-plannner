// Explore page JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  var searchInput = document.getElementById("destination-search");
  var filterTabs = document.querySelectorAll(".filter-tab");
  var filterTags = document.querySelectorAll(".filter-tag");
  var destinationCards = document.querySelectorAll(".destination-card");
  var paginationButtons = document.querySelectorAll(".pagination-btn");
  
  // Current filters
  var activeCategory = "all";
  var activeFilters = {
    season: null,
    feature: null,
    budget: null
  };
  
  // Search functionality
  searchInput.addEventListener("input", function() {
    var searchTerm = this.value.toLowerCase();
    filterDestinations();
  });
  
  // Filter tabs
  for (var i = 0; var i < filterTabs.length; i++) {
    filterTabs[i].addEventListener("click", function() {
      // Remove active class from all tabs
      for (var j = 0; j < filterTabs.length; j++) {
        filterTabs[j].classList.remove("active");
      }
      
      // Add active class to clicked tab
      this.classList.add("active");
      
      // Update active category
      activeCategory = this.getAttribute("data-filter");
      
      // Filter destinations
      filterDestinations();
    });
  }
  
  // Filter tags
  for (var i = 0; var i < filterTags.length; i++) {
    filterTags[i].addEventListener("click", function() {
      // Toggle active class
      this.classList.toggle("active");
      
      // Get filter type and value
      var filterType = null;
      if (this.hasAttribute("data-season")) {
        filterType = "season";
      } else if (this.hasAttribute("data-feature")) {
        filterType = "feature";
      } else if (this.hasAttribute("data-budget")) {
        filterType = "budget";
      }
      
      if (filterType) {
        var filterValue = this.getAttribute("data-" + filterType);
        
        // Update active filters
        if (this.classList.contains("active")) {
          activeFilters[filterType] = filterValue;
        } else {
          activeFilters[filterType] = null;
        }
        
        // Filter destinations
        filterDestinations();
      }
    });
  }
  
  // Filter destinations based on active filters
  function filterDestinations() {
    var searchTerm = searchInput.value.toLowerCase();
    
    for (var i = 0; i < destinationCards.length; i++) {
      var card = destinationCards[i];
      var cardCategory = card.getAttribute("data-category");
      var cardSeason = card.getAttribute("data-season");
      var cardTitle = card.querySelector("h3").textContent.toLowerCase();
      var cardDescription = card.querySelector(".destination-description").textContent.toLowerCase();
      
      // Check if card matches search term
      var matchesSearch = searchTerm === "" || 
                         cardTitle.includes(searchTerm) || 
                         cardDescription.includes(searchTerm);
      
      // Check if card matches category filter
      var matchesCategory = activeCategory === "all" || cardCategory === activeCategory;
      
      // Check if card matches season filter
      var matchesSeason = !activeFilters.season || cardSeason === activeFilters.season;
      
      // Check if card matches feature filter (simplified for demo)
      var matchesFeature = !activeFilters.feature;
      
      // Check if card matches budget filter (simplified for demo)
      var matchesBudget = !activeFilters.budget;
      
      // Show or hide card based on filters
      if (matchesSearch && matchesCategory && matchesSeason && matchesFeature && matchesBudget) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    }
  }
  
  // Pagination (simplified for demo)
  for (var i = 0; i < paginationButtons.length; i++) {
    paginationButtons[i].addEventListener("click", function() {
      if (this.disabled) return;
      
      // Remove active class from all buttons
      for (var j = 0; j < paginationButtons.length; j++) {
        paginationButtons[j].classList.remove("active");
      }
      
      // Add active class to clicked button
      this.classList.add("active");
      
      // In a real implementation, this would load the next page of results
      alert("Pagination would load page " + this.textContent);
    });
  }
});
