import { Anthropic } from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { images, analysis_type, site_id } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        error: "Anthropic API Key not configured." 
      }, { status: 500 })
    }

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 })
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      system: `You are ConstWare's AI Site Intelligence Engine for Indian 
          construction projects. Analyze these site photos and return a 
          detailed JSON report.
          
          Use current Indian market rates (2025):
          - Cement: ₹400/bag (50kg)
          - TMT Steel: ₹58,000/ton  
          - Bricks: ₹8/piece
          - Sand: ₹1,800/cubic meter
          - Aggregate: ₹1,400/cubic meter
          - Mason labour: ₹800-1200/day
          - Helper: ₹500-700/day
          - Electrician: ₹1000-1500/day
          - Plumber: ₹900-1400/day
          
          Be specific and realistic. If something is not visible, 
          make reasonable assumptions based on visible elements and 
          state your assumptions.`,
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
            {
              type: "text",
              text: `Analysis Type: ${analysis_type}
          
          Return ONLY valid JSON in this exact structure:
          {
            "summary": "string",
            "construction_stage": "foundation|structure|brickwork|plaster|finishing|complete",
            "progress_percent": number,
            "quality_score": number,
            "safety_score": number,
            "structural_analysis": {
              "visible_elements": ["string"],
              "structure_type": "string",
              "floors_visible": number,
              "estimated_built_area_sqft": number,
              "concerns": ["string"]
            },
            "material_estimation": {
              "cement_bags_remaining_needed": number,
              "steel_tons_remaining_needed": number,
              "bricks_remaining_needed": number,
              "sand_cubic_meters_needed": number,
              "notes": "string"
            },
            "cost_estimation": {
              "currency": "INR",
              "material_cost_remaining": { "total": number },
              "labour_cost_remaining": { "total": number },
              "total_estimated_cost_remaining": number,
              "cost_per_sqft_estimate": number,
              "grand_total_with_contingency": number
            },
            "quality_observations": {
              "positives": ["string"],
              "concerns": ["string"],
              "recommendations": ["string"]
            },
            "safety_observations": {
              "violations_found": ["string"],
              "missing_ppe": ["string"],
              "immediate_actions": ["string"]
            },
            "timeline_estimate": {
              "current_stage_completion_days": number,
              "total_remaining_days": number,
              "bottlenecks": ["string"]
            },
            "workforce_recommendation": {
              "recommended_workers": number,
              "skill_mix_needed": { "mason": number, "helper": number }
            },
            "ai_confidence": "high|medium|low"
          }`
            }
          ]
        }
      ]
    })

    const textContent = (response.content[0] as any).text
    // Extract JSON from response (in case there's extra text)
    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response")
    }

    const reportData = JSON.parse(jsonMatch[0])

    return NextResponse.json(reportData)
  } catch (error: any) {
    console.error("AI Analysis Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
