"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckSquare, ListChecks, Plus, Save, Trash2 } from "lucide-react"

// Default packing list categories and items
const defaultPackingList = {
  essentials: [
    { id: "e1", name: "Passport/ID", checked: false },
    { id: "e2", name: "Visa Documents", checked: false },
    { id: "e3", name: "Travel Insurance", checked: false },
    { id: "e4", name: "Flight/Train Tickets", checked: false },
    { id: "e5", name: "Hotel Reservations", checked: false },
    { id: "e6", name: "Cash/Cards", checked: false },
    { id: "e7", name: "Phone & Charger", checked: false },
    { id: "e8", name: "Power Bank", checked: false },
    { id: "e9", name: "Universal Adapter", checked: false },
  ],
  clothing: [
    { id: "c1", name: "T-shirts", checked: false },
    { id: "c2", name: "Pants/Shorts", checked: false },
    { id: "c3", name: "Underwear", checked: false },
    { id: "c4", name: "Socks", checked: false },
    { id: "c5", name: "Sleepwear", checked: false },
    { id: "c6", name: "Comfortable Walking Shoes", checked: false },
    { id: "c7", name: "Formal Outfit", checked: false },
    { id: "c8", name: "Rain Jacket/Umbrella", checked: false },
  ],
  toiletries: [
    { id: "t1", name: "Toothbrush & Toothpaste", checked: false },
    { id: "t2", name: "Shampoo & Conditioner", checked: false },
    { id: "t3", name: "Soap/Body Wash", checked: false },
    { id: "t4", name: "Deodorant", checked: false },
    { id: "t5", name: "Sunscreen", checked: false },
    { id: "t6", name: "Hand Sanitizer", checked: false },
    { id: "t7", name: "First Aid Kit", checked: false },
    { id: "t8", name: "Prescription Medications", checked: false },
  ],
  "india-specific": [
    { id: "i1", name: "Mosquito Repellent", checked: false },
    { id: "i2", name: "Stomach Medicine", checked: false },
    { id: "i3", name: "Water Purification Tablets", checked: false },
    { id: "i4", name: "Modest Clothing for Temples", checked: false },
    { id: "i5", name: "Light Scarf/Shawl", checked: false },
    { id: "i6", name: "Wet Wipes", checked: false },
    { id: "i7", name: "ORS Packets", checked: false },
  ],
}

interface PackingListProps {
  destination?: string
}

export default function PackingList({ destination }: PackingListProps) {
  const [activeTab, setActiveTab] = useState<string>("essentials")
  const [packingItems, setPackingItems] =
    useState<Record<string, { id: string; name: string; checked: boolean }[]>>(defaultPackingList)
  const [newItemName, setNewItemName] = useState<string>("")
  const [progress, setProgress] = useState<number>(0)

  // Calculate progress whenever items change
  useEffect(() => {
    const allItems = Object.values(packingItems).flat()
    const checkedItems = allItems.filter((item) => item.checked)
    const newProgress = allItems.length > 0 ? Math.round((checkedItems.length / allItems.length) * 100) : 0
    setProgress(newProgress)
  }, [packingItems])

  const handleAddItem = () => {
    if (!newItemName.trim()) return

    setPackingItems((prev) => {
      const newId = `custom-${Date.now()}`
      return {
        ...prev,
        [activeTab]: [...prev[activeTab], { id: newId, name: newItemName, checked: false }],
      }
    })
    setNewItemName("")
  }

  const handleToggleItem = (id: string) => {
    setPackingItems((prev) => {
      return Object.fromEntries(
        Object.entries(prev).map(([category, items]) => [
          category,
          items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
        ]),
      )
    })
  }

  const handleDeleteItem = (id: string) => {
    setPackingItems((prev) => {
      return Object.fromEntries(
        Object.entries(prev).map(([category, items]) => [category, items.filter((item) => item.id !== id)]),
      )
    })
  }

  const handleSaveList = () => {
    // In a real app, this would save to a database or localStorage
    alert("Packing list saved successfully!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ListChecks className="h-5 w-5 mr-2" />
          Packing List {destination ? `for ${destination.split(",")[0]}` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 bg-muted rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">{progress}% complete</p>
          <div className="flex items-center">
            <CheckSquare className="h-4 w-4 mr-1 text-primary" />
            <span className="text-sm">
              {
                Object.values(packingItems)
                  .flat()
                  .filter((item) => item.checked).length
              }{" "}
              of {Object.values(packingItems).flat().length} items packed
            </span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full justify-start overflow-x-auto">
            {Object.keys(packingItems).map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category.replace("-", " ")}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(packingItems).map(([category, items]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder={`Add new ${category.replace("-", " ")} item...`}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                />
                <Button size="icon" onClick={handleAddItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={() => handleToggleItem(item.id)}
                        />
                        <Label
                          htmlFor={item.id}
                          className={`${item.checked ? "line-through text-muted-foreground" : ""}`}
                        >
                          {item.name}
                        </Label>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveList} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Packing List
        </Button>
      </CardFooter>
    </Card>
  )
}
