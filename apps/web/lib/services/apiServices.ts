/**
 * Unified API Services for Static Export Compatibility
 * This file replaces internal /api/ routes to allow the project 
 * to be exported to a static Capacitor app (Android/iOS).
 */

// --- PRICE SERVICE ---
export const fetchMarketPrices = async () => {
  const basePrices = [
    { name: "Ultratech Cement", unit: "Bag (50kg)", price: 425, change: 2.4, trend: "up" },
    { name: "TMT Steel (12mm)", unit: "Ton", price: 62500, change: -1.2, trend: "down" },
    { name: "Red Bricks", unit: "1000 Pcs", price: 8500, change: 0.5, trend: "up" },
    { name: "Coarse Sand", unit: "Cu.Ft", price: 65, change: 0, trend: "stable" },
    { name: "Aggregates (20mm)", unit: "Cu.Ft", price: 58, change: 1.8, trend: "up" },
    { name: "White Cement", unit: "Bag (25kg)", price: 820, change: -0.5, trend: "down" },
    { name: "Paint (Apex)", unit: "20L Litre", price: 4800, change: 3.2, trend: "up" },
  ]

  return basePrices.map(p => ({
    ...p,
    currentPrice: p.price + (Math.random() * 10 - 5),
    lastUpdate: new Date().toISOString()
  }))
}

// --- WEATHER SERVICE ---
export const fetchWeatherData = async (lat: string, lon: string) => {
  const conditions = ["Clear", "Clouds", "Rain"]
  const descriptions = ["Sunny and dry", "Partly cloudy", "Heavy rain showers"]
  
  return {
    list: Array.from({ length: 40 }).map((_, i) => ({
      dt: Math.floor(Date.now() / 1000) + i * 10800,
      main: {
        temp: 32 + Math.random() * 5,
        humidity: 60 + Math.random() * 20,
      },
      weather: [{
        main: conditions[i % 3],
        description: descriptions[i % 3],
        icon: i % 3 === 0 ? "01d" : i % 3 === 1 ? "03d" : "10d"
      }],
      wind: { speed: 10 + Math.random() * 15 }
    }))
  }
}

// --- AI SERVICES ---
export const getAIAnalysis = async (type: string, data: any) => {
  // Mock AI responses for static environment consistency
  const mockResponses: Record<string, string> = {
    "site-analysis": "Based on the latest imagery, Site 'Green Valley' shows 85% progress on Phase 2. Recommendation: Increase workforce for tile laying to meet the May 15th deadline.",
    "document-scan": "Invoice recognized: UltraTech Cement. Quantity: 500 Bags. Amount: ₹2,12,500. GST: 28%. Total verified.",
    "estimator": "Projected cost for the foundation phase: ₹12,45,000. Material cost: ₹8,20,000. Labour cost: ₹4,25,000. Variance: -2% from budget.",
    "constbot": "Hello! I am ConstBot. I can help you with material rates, site management tips, or checking your daily reports. How can I assist you today?"
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return { content: { text: mockResponses[type] || "I am analyzing the data now..." } }
}
