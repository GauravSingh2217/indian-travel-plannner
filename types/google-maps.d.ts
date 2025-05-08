declare global {
  interface Window {
    google: {
      maps: {
        Map: any
        Marker: any
        InfoWindow: any
        LatLngBounds: any
        Geocoder: any
        DirectionsService: any
        DirectionsRenderer: any
        Animation: {
          DROP: number
          BOUNCE: number
        }
        GeocoderStatus: {
          OK: string
          ZERO_RESULTS: string
          OVER_QUERY_LIMIT: string
          REQUEST_DENIED: string
          INVALID_REQUEST: string
          UNKNOWN_ERROR: string
        }
        DirectionsStatus: {
          OK: string
          NOT_FOUND: string
          ZERO_RESULTS: string
          MAX_WAYPOINTS_EXCEEDED: string
          INVALID_REQUEST: string
          OVER_QUERY_LIMIT: string
          REQUEST_DENIED: string
          UNKNOWN_ERROR: string
        }
        TravelMode: {
          DRIVING: any
          WALKING: any
          BICYCLING: any
          TRANSIT: any
        }
        event: {
          addListener: (instance: any, eventName: string, handler: Function) => any
          removeListener: (listener: any) => void
        }
      }
    }
  }
}

export {}
