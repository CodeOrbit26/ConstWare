import { Anthropic } from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { 
      buildingType,
      totalArea,
      floors,
      exteriorStyle,
      roomList,
      city,
      grade,
      userInteriorSelections
    } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Anthropic API Key not configured." }, { status: 500 })
    }

    const systemPrompt = `You are India's top luxury interior designer. 
    Design the perfect interior for the specified project. 
    Return ONLY pure JSON. No markdown. No explanation.`

    const userPrompt = `Design the perfect interior for:
    Building: ${buildingType}, ${totalArea} sqft, ${floors} floors
    Style chosen: ${exteriorStyle}
    Rooms: ${JSON.stringify(roomList)}
    City: ${city}, Grade: ${grade}
    User preferences so far: ${JSON.stringify(userInteriorSelections)}

    Return ONLY JSON in this structure:
    {
      "design_theme": "name of overall theme",
      "design_story": "3 sentences about the vision",
      "color_palette": {
        "primary": "#hex",
        "secondary": "#hex", 
        "accent": "#hex",
        "neutral": "#hex"
      },
      "rooms": [
        {
          "room": "Living Room",
          "hero_element": "the one WOW feature",
          "wall_colors": { "main": "#hex", "accent_wall": "#hex" },
          "flooring": "material + color description",
          "ceiling": "design description",
          "lighting": "layered lighting description",
          "furniture_highlights": ["item1", "item2"],
          "luxury_details": ["detail1"],
          "estimated_cost": 0
        }
      ],
      "wow_features": [
        { "feature": "Grand entrance", "room": "Foyer", "estimated_cost": 0, "impact": "wow" }
      ],
      "total_interior_cost": 0
    }`

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    })

    const textContent = (response.content[0] as any).text
    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Could not parse JSON from AI response")

    return NextResponse.json(JSON.parse(jsonMatch[0]))
  } catch (error: any) {
    console.error("Interior Design Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
