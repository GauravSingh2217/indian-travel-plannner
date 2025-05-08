"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, RefreshCw } from "lucide-react"

// Exchange rates with INR as base (1 INR = x foreign currency)
// These would typically come from an API in a real application
const exchangeRates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AUD: 0.018,
  CAD: 0.016,
  SGD: 0.016,
  AED: 0.044,
  JPY: 1.78,
  CNY: 0.086,
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1000)
  const [fromCurrency, setFromCurrency] = useState<string>("INR")
  const [toCurrency, setToCurrency] = useState<string>("USD")
  const [convertedAmount, setConvertedAmount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Convert currency when inputs change
  useEffect(() => {
    convertCurrency()
  }, [amount, fromCurrency, toCurrency])

  const convertCurrency = () => {
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      // Convert to INR first if not already INR
      const amountInINR =
        fromCurrency === "INR" ? amount : amount / exchangeRates[fromCurrency as keyof typeof exchangeRates]

      // Then convert from INR to target currency
      const result = amountInINR * exchangeRates[toCurrency as keyof typeof exchangeRates]

      setConvertedAmount(Number.parseFloat(result.toFixed(2)))
      setIsLoading(false)
    }, 500)
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowLeftRight className="h-5 w-5 mr-2" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-2">
            <div className="grid gap-2">
              <Label htmlFor="fromCurrency">From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="fromCurrency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(exchangeRates).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={handleSwapCurrencies}>
              <ArrowLeftRight className="h-4 w-4" />
            </Button>

            <div className="grid gap-2">
              <Label htmlFor="toCurrency">To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="toCurrency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(exchangeRates).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Converted Amount</p>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <RefreshCw className="h-5 w-5 animate-spin inline mr-2" />
                  ) : (
                    <>
                      {convertedAmount.toLocaleString()} {toCurrency}
                    </>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Exchange Rate</p>
                <p className="text-sm">
                  1 {fromCurrency} ={" "}
                  {(
                    exchangeRates[toCurrency as keyof typeof exchangeRates] /
                    exchangeRates[fromCurrency as keyof typeof exchangeRates]
                  ).toFixed(4)}{" "}
                  {toCurrency}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            * Exchange rates are for demonstration purposes only. In a real application, these would be fetched from a
            currency API.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
