"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ShoppingBag, Star, IndianRupee, Calculator } from "lucide-react"

// Shopping destinations for major Indian cities with budget information
const shoppingData = {
  "Delhi, India": [
    {
      name: "Chandni Chowk",
      description: "Historic market known for textiles, spices, and street food",
      specialties: ["Textiles", "Jewelry", "Spices", "Street Food"],
      rating: 4.6,
      priceRange: "₹-₹₹",
      budgetEstimate: {
        low: 2000,
        medium: 5000,
        high: 10000,
      },
      mustBuyItems: [
        { name: "Banarasi Sarees", price: 3000 },
        { name: "Silver Jewelry", price: 2500 },
        { name: "Spice Mixes", price: 500 },
        { name: "Street Food Tasting", price: 800 },
      ],
    },
    {
      name: "Sarojini Nagar Market",
      description: "Popular for budget fashion and export surplus clothing",
      specialties: ["Fashion", "Accessories", "Footwear"],
      rating: 4.5,
      priceRange: "₹",
      budgetEstimate: {
        low: 1500,
        medium: 3000,
        high: 6000,
      },
      mustBuyItems: [
        { name: "Export Surplus Clothing", price: 1000 },
        { name: "Trendy Accessories", price: 500 },
        { name: "Footwear", price: 800 },
        { name: "Bags & Purses", price: 700 },
      ],
    },
    {
      name: "Dilli Haat",
      description: "Crafts bazaar featuring handmade items from across India",
      specialties: ["Handicrafts", "Textiles", "Art", "Regional Food"],
      rating: 4.7,
      priceRange: "₹₹",
      budgetEstimate: {
        low: 2500,
        medium: 5000,
        high: 8000,
      },
      mustBuyItems: [
        { name: "Handloom Textiles", price: 2000 },
        { name: "Handicrafts", price: 1500 },
        { name: "Paintings", price: 1200 },
        { name: "Regional Food Sampling", price: 600 },
      ],
    },
    {
      name: "Khan Market",
      description: "Upscale shopping area with boutiques and international brands",
      specialties: ["Designer Wear", "Books", "Gourmet Food"],
      rating: 4.4,
      priceRange: "₹₹₹",
      budgetEstimate: {
        low: 5000,
        medium: 10000,
        high: 20000,
      },
      mustBuyItems: [
        { name: "Designer Clothing", price: 6000 },
        { name: "Books", price: 1500 },
        { name: "Gourmet Food Products", price: 2000 },
        { name: "Home Decor", price: 3000 },
      ],
    },
  ],
  "Mumbai, India": [
    {
      name: "Colaba Causeway",
      description: "Bustling street market with fashion, accessories, and souvenirs",
      specialties: ["Fashion", "Antiques", "Souvenirs"],
      rating: 4.5,
      priceRange: "₹-₹₹",
      budgetEstimate: {
        low: 2000,
        medium: 4000,
        high: 8000,
      },
      mustBuyItems: [
        { name: "Bohemian Fashion", price: 1500 },
        { name: "Antique Collectibles", price: 2000 },
        { name: "Mumbai Souvenirs", price: 800 },
        { name: "Jewelry", price: 1200 },
      ],
    },
    {
      name: "Crawford Market",
      description: "Historic market known for fresh produce, spices, and household items",
      specialties: ["Spices", "Fruits", "Household Items"],
      rating: 4.3,
      priceRange: "₹",
      budgetEstimate: {
        low: 1000,
        medium: 2500,
        high: 5000,
      },
      mustBuyItems: [
        { name: "Exotic Spices", price: 600 },
        { name: "Dry Fruits", price: 1200 },
        { name: "Kitchen Utensils", price: 800 },
        { name: "Fresh Fruits", price: 500 },
      ],
    },
    {
      name: "Linking Road",
      description: "Popular shopping street with a mix of street vendors and branded stores",
      specialties: ["Fashion", "Footwear", "Accessories"],
      rating: 4.4,
      priceRange: "₹-₹₹",
      budgetEstimate: {
        low: 2000,
        medium: 4000,
        high: 7000,
      },
      mustBuyItems: [
        { name: "Trendy Clothing", price: 1500 },
        { name: "Footwear", price: 1000 },
        { name: "Accessories", price: 800 },
        { name: "Street Fashion", price: 1200 },
      ],
    },
    {
      name: "Phoenix Marketcity",
      description: "Luxury mall with international brands and entertainment options",
      specialties: ["Luxury Brands", "Electronics", "Entertainment"],
      rating: 4.7,
      priceRange: "₹₹₹",
      budgetEstimate: {
        low: 5000,
        medium: 10000,
        high: 25000,
      },
      mustBuyItems: [
        { name: "Designer Clothing", price: 8000 },
        { name: "Electronics", price: 5000 },
        { name: "Luxury Accessories", price: 4000 },
        { name: "Premium Cosmetics", price: 3000 },
      ],
    },
  ],
  "Jaipur, India": [
    {
      name: "Johari Bazaar",
      description: "Famous for jewelry, particularly Kundan and Meenakari work",
      specialties: ["Jewelry", "Gemstones", "Gold & Silver"],
      rating: 4.6,
      priceRange: "₹₹-₹₹₹",
      budgetEstimate: {
        low: 3000,
        medium: 8000,
        high: 20000,
      },
      mustBuyItems: [
        { name: "Kundan Jewelry", price: 5000 },
        { name: "Meenakari Work", price: 3500 },
        { name: "Gemstone Jewelry", price: 4000 },
        { name: "Silver Items", price: 2500 },
      ],
    },
    {
      name: "Bapu Bazaar",
      description: "Popular for textiles, especially Rajasthani prints and fabrics",
      specialties: ["Textiles", "Juttis", "Handicrafts"],
      rating: 4.5,
      priceRange: "₹-₹₹",
      budgetEstimate: {
        low: 2000,
        medium: 5000,
        high: 10000,
      },
      mustBuyItems: [
        { name: "Bandhani Textiles", price: 1500 },
        { name: "Rajasthani Juttis", price: 800 },
        { name: "Block Print Fabrics", price: 1200 },
        { name: "Rajasthani Quilts", price: 2000 },
      ],
    },
    {
      name: "Tripolia Bazaar",
      description: "Known for bangles, lacquer work, and traditional Rajasthani items",
      specialties: ["Bangles", "Lacquer Work", "Home Decor"],
      rating: 4.4,
      priceRange: "₹-₹₹",
      budgetEstimate: {
        low: 1500,
        medium: 3500,
        high: 7000,
      },
      mustBuyItems: [
        { name: "Lac Bangles", price: 800 },
        { name: "Lacquer Work Items", price: 1200 },
        { name: "Home Decor", price: 1500 },
        { name: "Wooden Crafts", price: 1000 },
      ],
    },
    {
      name: "Nehru Bazaar",
      description: "Famous for traditional Rajasthani footwear and textiles",
      specialties: ["Juttis", "Mojaris", "Textiles"],
      rating: 4.3,
      priceRange: "₹-₹₹",
      budgetEstimate: {
        low: 1500,
        medium: 3000,
        high: 6000,
      },
      mustBuyItems: [
        { name: "Mojaris", price: 900 },
        { name: "Embroidered Textiles", price: 1500 },
        { name: "Camel Leather Items", price: 1200 },
        { name: "Traditional Clothing", price: 1800 },
      ],
    },
  ],
  "Goa, India": [
    {
      name: "Anjuna Flea Market",
      description: "Weekly market known for handicrafts, clothing, and souvenirs",
      specialties: ["Handicrafts", "Beachwear", "Souvenirs"],
      rating: 4.5,
      priceRange: "₹-₹₹",
      budgetEstimate: {
        low: 2000,
        medium: 4000,
        high: 8000,
      },
      mustBuyItems: [
        { name: "Bohemian Clothing", price: 1200 },
        { name: "Beach Accessories", price: 800 },
        { name: "Handmade Jewelry", price: 1000 },
        { name: "Goan Souvenirs", price: 600 },
      ],
    },
    {
      name: "Mapusa Market",
      description: "Local market with Goan spices, cashews, and handicrafts",
      specialties: ["Spices", "Cashews", "Local Produce"],
      rating: 4.3,
      priceRange: "₹",
      budgetEstimate: {
        low: 1000,
        medium: 2500,
        high: 5000,
      },
      mustBuyItems: [
        { name: "Goan Spices", price: 500 },
        { name: "Cashew Nuts", price: 800 },
        { name: "Goan Feni", price: 600 },
        { name: "Local Handicrafts", price: 1000 },
      ],
    },
    {
      name: "Calangute Market Square",
      description: "Tourist-friendly market with clothing, accessories, and souvenirs",
      specialties: ["Beachwear", "Accessories", "Souvenirs"],
      rating: 4.2,
      priceRange: "₹-₹₹",
      budgetEstimate: {
        low: 1500,
        medium: 3000,
        high: 6000,
      },
      mustBuyItems: [
        { name: "Beach Clothing", price: 1000 },
        { name: "Shell Crafts", price: 600 },
        { name: "Beach Accessories", price: 800 },
        { name: "Souvenir T-shirts", price: 500 },
      ],
    },
    {
      name: "Arpora Saturday Night Market",
      description: "Vibrant night market with food, music, and unique items",
      specialties: ["Handicrafts", "Fashion", "Food", "Music"],
      rating: 4.7,
      priceRange: "₹₹",
      budgetEstimate: {
        low: 2500,
        medium: 5000,
        high: 10000,
      },
      mustBuyItems: [
        { name: "Handmade Crafts", price: 1500 },
        { name: "Designer Beachwear", price: 2000 },
        { name: "Unique Jewelry", price: 1200 },
        { name: "International Food", price: 1000 },
      ],
    },
  ],
}

interface ShoppingDestinationsProps {
  destination: string
}

export default function ShoppingDestinations({ destination }: ShoppingDestinationsProps) {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string[] }>({})
  const [customBudget, setCustomBudget] = useState<number>(0)
  const [showBudgetInput, setShowBudgetInput] = useState<boolean>(false)

  // Get shopping destinations for the selected location
  const shoppingDestinations = shoppingData[destination as keyof typeof shoppingData] || []

  // Initialize selected items for each shopping place
  useEffect(() => {
    if (shoppingDestinations.length > 0) {
      const initialSelectedItems: { [key: string]: string[] } = {}
      shoppingDestinations.forEach((shop) => {
        initialSelectedItems[shop.name] = []
      })
      setSelectedItems(initialSelectedItems)
    }
  }, [destination, shoppingDestinations])

  // Toggle item selection
  const toggleItemSelection = (shopName: string, itemName: string) => {
    setSelectedItems((prev) => {
      const currentItems = [...(prev[shopName] || [])]
      if (currentItems.includes(itemName)) {
        return {
          ...prev,
          [shopName]: currentItems.filter((item) => item !== itemName),
        }
      } else {
        return {
          ...prev,
          [shopName]: [...currentItems, itemName],
        }
      }
    })
  }

  // Calculate total shopping budget
  const calculateTotalBudget = () => {
    let total = 0

    Object.entries(selectedItems).forEach(([shopName, items]) => {
      const shop = shoppingDestinations.find((s) => s.name === shopName)
      if (shop) {
        items.forEach((itemName) => {
          const item = shop.mustBuyItems.find((i) => i.name === itemName)
          if (item) {
            total += item.price
          }
        })
      }
    })

    return total + customBudget
  }

  // If no shopping data is available for this destination
  if (shoppingDestinations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Shopping Destinations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No shopping information available for this destination yet.</p>
        </CardContent>
      </Card>
    )
  }

  // Get unique specialties for tabs
  const allSpecialties = shoppingDestinations.flatMap((shop) => shop.specialties)
  const uniqueSpecialties = Array.from(new Set(allSpecialties)).slice(0, 4) // Limit to 4 categories for tabs

  const totalBudget = calculateTotalBudget()

  return (
    <div className="space-y-6">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <IndianRupee className="h-5 w-5 mr-2" />
            Shopping Budget
          </h3>
          <Badge variant="outline" className="text-lg px-3 py-1">
            ₹{totalBudget.toLocaleString()}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <ShoppingBag className="h-3 w-3" />
            Selected Items: ₹{(totalBudget - customBudget).toLocaleString()}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calculator className="h-3 w-3" />
            Custom Budget: ₹{customBudget.toLocaleString()}
          </Badge>
        </div>

        {showBudgetInput ? (
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Enter additional budget"
              value={customBudget || ""}
              onChange={(e) => setCustomBudget(Number.parseInt(e.target.value) || 0)}
              className="max-w-xs"
            />
            <Button size="sm" onClick={() => setShowBudgetInput(false)}>
              Save
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowBudgetInput(true)}>
            Add Custom Budget
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {uniqueSpecialties.map((specialty) => (
            <TabsTrigger key={specialty} value={specialty}>
              {specialty}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {shoppingDestinations.map((shop, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{shop.name}</CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">{shop.description}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{shop.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {shop.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Budget Estimate</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="bg-muted p-2 rounded text-center">
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">₹{shop.budgetEstimate.low.toLocaleString()}</p>
                      </div>
                      <div className="bg-muted p-2 rounded text-center">
                        <p className="text-muted-foreground">Moderate</p>
                        <p className="font-medium">₹{shop.budgetEstimate.medium.toLocaleString()}</p>
                      </div>
                      <div className="bg-muted p-2 rounded text-center">
                        <p className="text-muted-foreground">Luxury</p>
                        <p className="font-medium">₹{shop.budgetEstimate.high.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Must-Buy Items</p>
                    <div className="space-y-2">
                      {shop.mustBuyItems.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${shop.name}-${item.name}`}
                              checked={selectedItems[shop.name]?.includes(item.name)}
                              onCheckedChange={() => toggleItemSelection(shop.name, item.name)}
                            />
                            <Label htmlFor={`${shop.name}-${item.name}`}>{item.name}</Label>
                          </div>
                          <span className="text-sm">₹{item.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="w-full flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Price Range: {shop.priceRange}</div>
                  <div className="text-sm font-medium">
                    Selected: ₹
                    {shop.mustBuyItems
                      .filter((item) => selectedItems[shop.name]?.includes(item.name))
                      .reduce((sum, item) => sum + item.price, 0)
                      .toLocaleString()}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        {uniqueSpecialties.map((specialty) => (
          <TabsContent key={specialty} value={specialty} className="space-y-4">
            {shoppingDestinations
              .filter((shop) => shop.specialties.includes(specialty))
              .map((shop, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{shop.name}</CardTitle>
                        <p className="text-muted-foreground text-sm mt-1">{shop.description}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{shop.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Specialties</p>
                        <div className="flex flex-wrap gap-2">
                          {shop.specialties.map((s) => (
                            <Badge key={s} variant={s === specialty ? "default" : "secondary"}>
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Budget Estimate</p>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="bg-muted p-2 rounded text-center">
                            <p className="text-muted-foreground">Budget</p>
                            <p className="font-medium">₹{shop.budgetEstimate.low.toLocaleString()}</p>
                          </div>
                          <div className="bg-muted p-2 rounded text-center">
                            <p className="text-muted-foreground">Moderate</p>
                            <p className="font-medium">₹{shop.budgetEstimate.medium.toLocaleString()}</p>
                          </div>
                          <div className="bg-muted p-2 rounded text-center">
                            <p className="text-muted-foreground">Luxury</p>
                            <p className="font-medium">₹{shop.budgetEstimate.high.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Must-Buy Items</p>
                        <div className="space-y-2">
                          {shop.mustBuyItems.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${shop.name}-${item.name}-${specialty}`}
                                  checked={selectedItems[shop.name]?.includes(item.name)}
                                  onCheckedChange={() => toggleItemSelection(shop.name, item.name)}
                                />
                                <Label htmlFor={`${shop.name}-${item.name}-${specialty}`}>{item.name}</Label>
                              </div>
                              <span className="text-sm">₹{item.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="w-full flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Price Range: {shop.priceRange}</div>
                      <div className="text-sm font-medium">
                        Selected: ₹
                        {shop.mustBuyItems
                          .filter((item) => selectedItems[shop.name]?.includes(item.name))
                          .reduce((sum, item) => sum + item.price, 0)
                          .toLocaleString()}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
