// Route Optimizer for Travel Planner
// This module handles route optimization using Google Maps Directions API

class RouteOptimizer {
  constructor() {
    this.apiKey = window.GOOGLE_MAPS_API_KEY || ""
    this.directionsService = null
    this.initGoogleMaps()
  }

  // Initialize Google Maps services
  async initGoogleMaps() {
    if (window.google && window.google.maps) {
      this.directionsService = new google.maps.DirectionsService()
    } else {
      console.warn("Google Maps not loaded yet. Some features may not work.")
    }
  }

  // Optimize route for a list of destinations
  async optimizeRoute(destinations, startPoint = null, endPoint = null) {
    if (!this.directionsService) {
      await this.initGoogleMaps()
      if (!this.directionsService) {
        throw new Error("Google Maps Directions service not available")
      }
    }

    // If we have less than 3 points (including start and end), no optimization needed
    if (destinations.length < 3) {
      return destinations
    }

    const origin = startPoint || destinations[0]
    const destination = endPoint || destinations[destinations.length - 1]

    // Waypoints are all destinations except origin and destination
    const waypoints = []
    for (let i = 0; i < destinations.length; i++) {
      // Skip origin and destination if they're part of the destinations array
      if ((startPoint && destinations[i] === startPoint) || (endPoint && destinations[i] === endPoint)) {
        continue
      }

      // If no custom start/end points, skip first and last destinations
      if (!startPoint && i === 0) continue
      if (!endPoint && i === destinations.length - 1) continue

      waypoints.push({
        location: destinations[i],
        stopover: true,
      })
    }

    // Request route with optimization
    const request = {
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    }

    try {
      const result = await new Promise((resolve, reject) => {
        this.directionsService.route(request, (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            resolve(response)
          } else {
            reject(new Error(`Directions request failed: ${status}`))
          }
        })
      })

      // Get the optimized waypoint order
      const waypointOrder = result.routes[0].waypoint_order

      // Reorder destinations based on the optimized waypoint order
      const optimizedDestinations = []

      // Add start point if provided
      if (startPoint) {
        optimizedDestinations.push(startPoint)
      } else {
        optimizedDestinations.push(destinations[0])
      }

      // Add waypoints in optimized order
      for (let i = 0; i < waypointOrder.length; i++) {
        const waypointIndex = waypointOrder[i]
        optimizedDestinations.push(waypoints[waypointIndex].location)
      }

      // Add end point if provided
      if (endPoint) {
        optimizedDestinations.push(endPoint)
      } else {
        optimizedDestinations.push(destinations[destinations.length - 1])
      }

      return {
        optimizedDestinations,
        directions: result,
      }
    } catch (error) {
      console.error("Error optimizing route:", error)
      throw error
    }
  }

  // Calculate total distance and duration for a route
  calculateRouteStats(directionsResult) {
    if (!directionsResult || !directionsResult.routes || directionsResult.routes.length === 0) {
      return { totalDistance: 0, totalDuration: 0 }
    }

    let totalDistance = 0
    let totalDuration = 0
    const legs = directionsResult.routes[0].legs

    for (let i = 0; i < legs.length; i++) {
      totalDistance += legs[i].distance.value // in meters
      totalDuration += legs[i].duration.value // in seconds
    }

    return {
      totalDistance: totalDistance / 1000, // convert to kilometers
      totalDuration: totalDuration / 60, // convert to minutes
      formattedDistance: `${(totalDistance / 1000).toFixed(1)} km`,
      formattedDuration: this.formatDuration(totalDuration),
    }
  }

  // Format duration in seconds to a readable string
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours} hr ${minutes} min`
    } else {
      return `${minutes} min`
    }
  }
}

// Create a singleton instance
const routeOptimizer = new RouteOptimizer()
