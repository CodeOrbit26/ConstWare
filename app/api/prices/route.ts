import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

// Simulated market data for early 2025
// In a real production app, this would scrape IndiaMART or use a paid construction API
export async function GET() {
  const basePrices = [
    { name: "Ultratech Cement", unit: "Bag (50kg)", price: 425, change: 2.4, trend: "up" },
    { name: "TMT Steel (12mm)", unit: "Ton", price: 62500, change: -1.2, trend: "down" },
    { name: "Red Bricks", unit: "1000 Pcs", price: 8500, change: 0.5, trend: "up" },
    { name: "Coarse Sand", unit: "Cu.Ft", price: 65, change: 0, trend: "stable" },
    { name: "Aggregates (20mm)", unit: "Cu.Ft", price: 58, change: 1.8, trend: "up" },
    { name: "White Cement", unit: "Bag (25kg)", price: 820, change: -0.5, trend: "down" },
    { name: "Paint (Apex)", unit: "20L Litre", price: 4800, change: 3.2, trend: "up" },
  ]

  // Add some randomness to simulate real market fluctuation
  const fluctuatingPrices = basePrices.map(p => ({
    ...p,
    currentPrice: p.price + (Math.random() * 10 - 5), // +/- 5 fluctuation
    lastUpdate: new Date().toISOString()
  }))

  return NextResponse.json(fluctuatingPrices)
}
