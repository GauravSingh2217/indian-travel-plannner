"use client"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { format, differenceInDays } from "date-fns"
import { useState, useEffect } from "react"

interface DateSelectorProps {
  startDate: Date | undefined
  endDate: Date | undefined
  onChange: (dates: { startDate: Date | undefined; endDate: Date | undefined }) => void
}

export default function DateSelector({ startDate, endDate, onChange }: DateSelectorProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: startDate,
    to: endDate,
  })

  useEffect(() => {
    onChange({
      startDate: dateRange.from,
      endDate: dateRange.to,
    })
  }, [dateRange, onChange])

  // Calculate trip duration
  const tripDuration = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">When are you traveling?</h2>
        <p className="text-muted-foreground mb-6">Select your travel dates to help us plan your perfect itinerary.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardContent className="pt-6">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              disabled={{ before: new Date() }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="flex-1">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Trip Summary</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{dateRange.from ? format(dateRange.from, "PPP") : "Not selected"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{dateRange.to ? format(dateRange.to, "PPP") : "Not selected"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {tripDuration > 0 ? `${tripDuration} ${tripDuration === 1 ? "day" : "days"}` : "Not calculated"}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>Tip:</strong> For the best experience, we recommend planning trips at least 2 weeks in advance
                  to get the best availability and prices.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
