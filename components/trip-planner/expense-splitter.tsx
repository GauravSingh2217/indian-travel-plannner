"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calculator, Plus, Trash2, Users } from "lucide-react"

interface Expense {
  id: string
  description: string
  amount: number
  paidBy: string
  splitWith: string[]
}

interface Traveler {
  id: string
  name: string
}

export default function ExpenseSplitter() {
  const [travelers, setTravelers] = useState<Traveler[]>([
    { id: "1", name: "You" },
    { id: "2", name: "Traveler 2" },
  ])
  const [newTravelerName, setNewTravelerName] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newExpense, setNewExpense] = useState<Omit<Expense, "id">>({
    description: "",
    amount: 0,
    paidBy: "1",
    splitWith: ["1", "2"],
  })

  // Add a new traveler
  const handleAddTraveler = () => {
    if (!newTravelerName.trim()) return

    const newTraveler = {
      id: `${travelers.length + 1}`,
      name: newTravelerName,
    }

    setTravelers([...travelers, newTraveler])
    setNewTravelerName("")
  }

  // Add a new expense
  const handleAddExpense = () => {
    if (!newExpense.description || newExpense.amount <= 0 || newExpense.splitWith.length === 0) return

    const expense: Expense = {
      id: Date.now().toString(),
      ...newExpense,
    }

    setExpenses([...expenses, expense])
    setNewExpense({
      description: "",
      amount: 0,
      paidBy: "1",
      splitWith: travelers.map((t) => t.id),
    })
  }

  // Delete an expense
  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  // Toggle traveler selection for splitting
  const handleToggleSplitWith = (travelerId: string) => {
    setNewExpense((prev) => {
      if (prev.splitWith.includes(travelerId)) {
        return {
          ...prev,
          splitWith: prev.splitWith.filter((id) => id !== travelerId),
        }
      } else {
        return {
          ...prev,
          splitWith: [...prev.splitWith, travelerId],
        }
      }
    })
  }

  // Calculate who owes whom
  const calculateBalances = () => {
    const balances: Record<string, number> = {}

    // Initialize balances for all travelers
    travelers.forEach((traveler) => {
      balances[traveler.id] = 0
    })

    // Calculate expenses
    expenses.forEach((expense) => {
      const paidBy = expense.paidBy
      const splitWith = expense.splitWith
      const amountPerPerson = expense.amount / splitWith.length

      // Add the full amount to the person who paid
      balances[paidBy] += expense.amount

      // Subtract the split amount from each person who owes
      splitWith.forEach((personId) => {
        balances[personId] -= amountPerPerson
      })
    })

    return balances
  }

  // Generate settlement plan
  const generateSettlementPlan = () => {
    const balances = calculateBalances()
    const settlements: { from: string; to: string; amount: number }[] = []

    const debtors = Object.entries(balances)
      .filter(([_, amount]) => amount < 0)
      .sort(([_, a], [__, b]) => a - b)

    const creditors = Object.entries(balances)
      .filter(([_, amount]) => amount > 0)
      .sort(([_, a], [__, b]) => b - a)

    let i = 0,
      j = 0

    while (i < debtors.length && j < creditors.length) {
      const [debtorId, debtorBalance] = debtors[i]
      const [creditorId, creditorBalance] = creditors[j]

      const absDebtorBalance = Math.abs(debtorBalance)
      const absCreditorBalance = Math.abs(creditorBalance)

      const amount = Math.min(absDebtorBalance, absCreditorBalance)

      if (amount > 0) {
        settlements.push({
          from: debtorId,
          to: creditorId,
          amount: Number.parseFloat(amount.toFixed(2)),
        })
      }

      if (absDebtorBalance < absCreditorBalance) {
        creditors[j] = [creditorId, creditorBalance - absDebtorBalance]
        i++
      } else if (absDebtorBalance > absCreditorBalance) {
        debtors[i] = [debtorId, debtorBalance + absCreditorBalance]
        j++
      } else {
        i++
        j++
      }
    }

    return settlements
  }

  const settlements = generateSettlementPlan()
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Expense Splitter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Travelers Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">Travelers</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {travelers.map((traveler) => (
              <div key={traveler.id} className="bg-muted px-3 py-1 rounded-full text-sm">
                {traveler.name}
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              placeholder="Add traveler name..."
              value={newTravelerName}
              onChange={(e) => setNewTravelerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTraveler()}
            />
            <Button size="sm" onClick={handleAddTraveler}>
              <Users className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Add Expense Section */}
        <div>
          <h3 className="text-lg font-medium mb-3">Add Expense</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Dinner, Taxi, Hotel"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newExpense.amount || ""}
                onChange={(e) => setNewExpense({ ...newExpense, amount: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paidBy">Paid By</Label>
              <Select
                value={newExpense.paidBy}
                onValueChange={(value) => setNewExpense({ ...newExpense, paidBy: value })}
              >
                <SelectTrigger id="paidBy">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {travelers.map((traveler) => (
                    <SelectItem key={traveler.id} value={traveler.id}>
                      {traveler.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Split With</Label>
              <div className="flex flex-wrap gap-2">
                {travelers.map((traveler) => (
                  <Button
                    key={traveler.id}
                    variant={newExpense.splitWith.includes(traveler.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleSplitWith(traveler.id)}
                  >
                    {traveler.name}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={handleAddExpense}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Expenses List */}
        <div>
          <h3 className="text-lg font-medium mb-3">Expenses</h3>
          {expenses.length > 0 ? (
            <ScrollArea className="h-[200px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid By</TableHead>
                    <TableHead>Split With</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>₹{expense.amount.toFixed(2)}</TableCell>
                      <TableCell>{travelers.find((t) => t.id === expense.paidBy)?.name}</TableCell>
                      <TableCell>
                        {expense.splitWith.map((id) => travelers.find((t) => t.id === id)?.name).join(", ")}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No expenses added yet</div>
          )}
        </div>

        {/* Summary */}
        {expenses.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Summary</h3>
            <div className="bg-muted p-4 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <span>Total Expenses:</span>
                <span className="font-bold">₹{totalExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Per Person (Equal Split):</span>
                <span>₹{(totalExpenses / travelers.length).toFixed(2)}</span>
              </div>
            </div>

            <h4 className="font-medium mb-2">Settlement Plan</h4>
            {settlements.length > 0 ? (
              <div className="space-y-2">
                {settlements.map((settlement, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                    <div>
                      <span className="font-medium">{travelers.find((t) => t.id === settlement.from)?.name}</span>
                      {" pays "}
                      <span className="font-medium">{travelers.find((t) => t.id === settlement.to)?.name}</span>
                    </div>
                    <div className="font-bold">₹{settlement.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">Everyone is settled up!</div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Tip: For accurate splitting, make sure to add all expenses and select the correct people who shared each
          expense.
        </p>
      </CardFooter>
    </Card>
  )
}
