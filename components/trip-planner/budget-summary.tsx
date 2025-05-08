"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IndianRupee, DollarSign, Hotel, Utensils, Bus, Ticket, ShoppingBag } from "lucide-react"

interface BudgetSummaryProps {
  destinations: string[]
  duration: number
  travelers: string
  preferences: {
    budget: string
    accommodation: string
    transportation: string
  }
  shoppingBudget?: number
}

export default function BudgetSummary({
  destinations,
  duration,
  travelers,
  preferences,
  shoppingBudget = 0,
}: BudgetSummaryProps) {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR")
  const [numTravelers, setNumTravelers] = useState(2)

  // Parse the travelers string to get a number
  useEffect(() => {
    const parsedNum = Number.parseInt(travelers)
    if (!isNaN(parsedNum)) {
      setNumTravelers(parsedNum)
    } else {
      // Handle descriptive strings
      if (travelers.toLowerCase().includes("couple")) {
        setNumTravelers(2)
      } else if (travelers.toLowerCase().includes("family")) {
        setNumTravelers(4)
      } else if (travelers.toLowerCase().includes("group")) {
        // Try to extract a number from "group of X"
        const match = travelers.match(/\d+/)
        if (match) {
          setNumTravelers(Number.parseInt(match[0]))
        } else {
          setNumTravelers(5) // Default for "group"
        }
      } else {
        setNumTravelers(2) // Default
      }
    }
  }, [travelers])

  // Calculate budget estimates based on preferences
  const calculateBudget = () => {
    // Base daily costs in INR
    const baseCosts = {
      budget: {
        accommodation: 1500,
        food: 800,
        transportation: 500,
        activities: 1000,
      },
      medium: {
        accommodation: 4000,
        food: 1500,
        transportation: 1000,
        activities: 2000,
      },
      luxury: {
        accommodation: 10000,
        food: 3000,
        transportation: 2500,
        activities: 4000,
      },
    }

    // Adjust for accommodation preference
    let accommodationMultiplier = 1
    if (preferences.accommodation === "hostel") accommodationMultiplier = 0.7
    if (preferences.accommodation === "apartment") accommodationMultiplier = 1.2
    if (preferences.accommodation === "camping") accommodationMultiplier = 0.6

    // Adjust for transportation preference
    let transportationMultiplier = 1
    if (preferences.transportation === "rental") transportationMultiplier = 1.5
    if (preferences.transportation === "taxi") transportationMultiplier = 1.3
    if (preferences.transportation === "flights") transportationMultiplier = 2

    // Calculate total costs
    const dailyCosts = baseCosts[preferences.budget as keyof typeof baseCosts]

    const accommodationTotal = dailyCosts.accommodation * accommodationMultiplier * duration
    const foodTotal = dailyCosts.food * duration * numTravelers
    const transportationTotal = dailyCosts.transportation * transportationMultiplier * duration * numTravelers
    const activitiesTotal = dailyCosts.activities * duration * numTravelers

    // Add shopping budget
    const totalBudget = accommodationTotal + foodTotal + transportationTotal + activitiesTotal + shoppingBudget

    // Convert to USD if needed
    if (currency === "USD") {
      return {
        accommodation: Math.round(accommodationTotal / 83),
        food: Math.round(foodTotal / 83),
        transportation: Math.round(transportationTotal / 83),
        activities: Math.round(activitiesTotal / 83),
        shopping: Math.round(shoppingBudget / 83),
        total: Math.round(totalBudget / 83),
      }
    }

    return {
      accommodation: Math.round(accommodationTotal),
      food: Math.round(foodTotal),
      transportation: Math.round(transportationTotal),
      activities: Math.round(activitiesTotal),
      shopping: Math.round(shoppingBudget),
      total: Math.round(totalBudget),
    }
  }

  const budget = calculateBudget()
  const currencySymbol = currency === "INR" ? "₹" : "$"

  // Calculate percentages for the progress bars
  const getPercentage = (value: number) => {
    return Math.round((value / budget.total) * 100)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Budget Estimate</CardTitle>
          <Tabs value={currency} onValueChange={(value) => setCurrency(value as "INR" | "USD")} className="w-auto">
            <TabsList className="h-8 p-1">
              <TabsTrigger value="INR" className="text-xs h-6 px-2 py-0 flex items-center">
                <IndianRupee className="h-3 w-3 mr-1" /> INR
              </TabsTrigger>
              <TabsTrigger value="USD" className="text-xs h-6 px-2 py-0 flex items-center">
                <DollarSign className="h-3 w-3 mr-1" /> USD
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {duration} days, {numTravelers} {numTravelers === 1 ? "traveler" : "travelers"}
          </span>
          <span className="font-bold text-xl">
            {currencySymbol}
            {budget.total.toLocaleString()}
          </span>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <Hotel className="h-4 w-4 mr-2 text-blue-500" />
                <span>Accommodation</span>
              </div>
              <span>
                {currencySymbol}
                {budget.accommodation.toLocaleString()}
              </span>
            </div>
            <Progress value={getPercentage(budget.accommodation)} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <Utensils className="h-4 w-4 mr-2 text-green-500" />
                <span>Food & Dining</span>
              </div>
              <span>
                {currencySymbol}
                {budget.food.toLocaleString()}
              </span>
            </div>
            <Progress value={getPercentage(budget.food)} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <Bus className="h-4 w-4 mr-2 text-orange-500" />
                <span>Transportation</span>
              </div>
              <span>
                {currencySymbol}
                {budget.transportation.toLocaleString()}
              </span>
            </div>
            <Progress value={getPercentage(budget.transportation)} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <Ticket className="h-4 w-4 mr-2 text-purple-500" />
                <span>Activities</span>
              </div>
              <span>
                {currencySymbol}
                {budget.activities.toLocaleString()}
              </span>
            </div>
            <Progress value={getPercentage(budget.activities)} className="h-2" />
          </div>

          {shoppingBudget > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2 text-pink-500" />
                  <span>Shopping</span>
                </div>
                <span>
                  {currencySymbol}
                  {budget.shopping.toLocaleString()}
                </span>
              </div>
              <Progress value={getPercentage(budget.shopping)} className="h-2" />
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground mt-4">
          <p>
            * Budget estimates are based on average costs and may vary based on season, specific accommodations, and
            activities.
          </p>
          <p>* Accommodation costs are per room/unit, not per person.</p>
        </div>
      </CardContent>
    </Card>
  )
}
