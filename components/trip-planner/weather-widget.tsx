"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Cloud, CloudRain, Sun, Loader } from "lucide-react"

interface WeatherWidgetProps {
  destination: string
  date: Date
}

// Mock weather data
const getWeatherForecast = (destination: string, date: Date) => {
  // In a real app, this would call a weather API
  const weatherTypes = ["sunny", "cloudy", "rainy"]
  const tempRanges = {
    "Paris, France": { min: 15, max: 25 },
    "Tokyo, Japan": { min: 18, max: 28 },
    "New York, USA": { min: 10, max: 22 },
    "Rome, Italy": { min: 18, max: 30 },
    default: { min: 15, max: 25 },
  }

  // Get temperature range for the destination or use default
  const tempRange = tempRanges[destination as keyof typeof tempRanges] || tempRanges.default

  // Generate a random temperature within the range
  const temp = Math.floor(Math.random() * (tempRange.max - tempRange.min + 1)) + tempRange.min

  // Get a random weather type
  const weatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)]

  return {
    temperature: temp,
    weatherType,
    date: format(date, "MMM d"),
  }
}

export default function WeatherWidget({ destination, date }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const forecast = getWeatherForecast(destination, date)
      setWeather(forecast)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [destination, date])

  const getWeatherIcon = (type: string) => {
    switch (type) {
      case "sunny":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-5 w-5 text-gray-400" />
      case "rainy":
        return <CloudRain className="h-5 w-5 text-blue-400" />
      default:
        return <Sun className="h-5 w-5 text-yellow-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Loader className="h-3 w-3 animate-spin" />
        <span>Loading weather...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm">
      {getWeatherIcon(weather.weatherType)}
      <span>{weather.temperature}°C</span>
    </div>
  )
}
