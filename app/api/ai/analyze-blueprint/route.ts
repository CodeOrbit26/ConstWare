import { Anthropic } from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { 
      floorImages, 
      plotArea, 
      buildingUse, 
      city 
    } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Anthropic API Key not configured." }, { status: 500 })
    }

    const systemPrompt = `You are a master architect and 3D visualization expert.
    Analyze the provided floor plan images (one per floor) and return ONLY valid JSON. 
    No markdown. No explanation. No surrounding text.`

    const userPrompt = [
      ...floorImages.map((img: string) => ({
        type: "image",
        source: { 
          type: "base64", 
          media_type: "image/jpeg", 
          data: img.split(',')[1] // Assuming base64 data url
        }
      })),
      {
        type: "text",
        text: `Plot Area: ${plotArea} sqft | City: ${city} | Building Use: ${buildingUse}
        Number of floors uploaded: ${floorImages.length}
        
        Analyze these floor plans carefully. Identify rooms, dimensions, and structural layout.
        Return the response in this EXACT JSON structure:
        {
          "floors": [
            {
              "floor_name": "Ground Floor",
              "floor_area_sqft": 0,
              "rooms": [
                { "name": "Living Room", "approx_length_ft": 0, "approx_width_ft": 0, "area_sqft": 0, "windows": 2, "doors": 1 }
              ],
              "total_rooms": 0,
              "bathrooms": 0,
              "has_kitchen": true,
              "has_balcony": false,
              "has_staircase": false
            }
          ],
          "building": {
            "total_built_up_area_sqft": 0,
            "total_floors": 0,
            "estimated_footprint_length_ft": 0,
            "estimated_footprint_width_ft": 0,
            "total_height_ft": 0,
            "floor_height_ft": 10,
            "roof_type": "flat|sloped|terrace",
            "shape": "rectangular|L_shaped|U_shaped",
            "entrance_facing": "front|left|right",
            "has_balcony": true,
            "balcony_floor": 1,
            "has_terrace": true
          },
          "color_combinations": [
            {
              "name": "Modern Sand & White",
              "theme": "modern",
              "wall_color": "#E8D5B0",
              "wall_color_name": "Warm Sand",
              "trim_color": "#FFFFFF",
              "trim_color_name": "Pure White",
              "roof_color": "#5C4033",
              "roof_color_name": "Deep Brown",
              "door_color": "#2C1810",
              "door_color_name": "Mahogany",
              "window_frame_color": "#FFFFFF",
              "railing_color": "#1A1A1A",
              "accent_color": "#F97316",
              "accent_color_name": "Terracotta Orange",
              "description": "Clean modern look with warm earthy tones",
              "best_for": "Modern homes, good resale value",
              "popularity": "Most popular"
            },
            // ... provide at least 5 varied combinations
          ]
        }`
      }
    ]

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 6000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt as any }]
    })

    const textContent = (response.content[0] as any).text
    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Could not parse JSON from AI response")

    return NextResponse.json(JSON.parse(jsonMatch[0]))
  } catch (error: any) {
    console.error("Blueprint Analysis Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
