import { Anthropic } from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { images } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        error: "Anthropic API Key not configured." 
      }, { status: 500 })
    }

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "No photos provided for analysis" }, { status: 400 })
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 2000,
      system: `You are ConstWare's AI Site Supervisor. Analyze these site photos and help fill the Daily Progress Report (DPR).
      Identify:
      1. Summary of work done (be specific about civil/finishing stages).
      2. Work-done tags (Foundation, Slab, Plastering, Tiling, Electrical, Plumbing, Finishing).
      3. Materials being used (Cement, Steel, Bricks, Sand, Aggregate).
      4. Any visible safety or quality issues.
      
      Return ONLY valid JSON:
      {
        "summary": "string",
        "workDoneTags": ["string"],
        "materialsUsed": [{"name": "string", "quantity": number}],
        "issues": "string",
        "severity": "none|low|medium|high"
      }`,
      messages: [
        {
          role: "user",
          content: [
            ...images.map((img: string) => ({
              type: "image",
              source: { 
                type: "base64", 
                media_type: "image/jpeg", 
                data: img.replace(/^data:image\/(png|jpeg|webp);base64,/, "")
              }
            })),
            { type: "text", text: "Analyze these photos for the DPR." }
          ]
        }
      ]
    })

    const textContent = (response.content[0] as any).text
    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Could not parse JSON")

    return NextResponse.json(JSON.parse(jsonMatch[0]))
  } catch (error: any) {
    console.error("AI DPR Analysis Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
