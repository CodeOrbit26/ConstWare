import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { 
      projectType, 
      area_sqft, 
      floors, 
      city, 
      finishingLevel, 
      soilType,
      basement,
      blueprintImages = [] 
    } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey.includes('placeholder')) {
      return NextResponse.json(getMockData(projectType, area_sqft, floors, city))
    }

    const systemPrompt = `You are ConstWare's Enterprise AI Cost Estimation Engine for Indian construction (2025 rates). 
    Generate a COMPLETE, REALISTIC construction estimate for a project in ${city}. 
    Return ONLY valid JSON.
    Analyze the architectural floor plans if provided to refine quantities.`

    const userPrompt = `
      INPUT:
      - Type: ${projectType}
      - Area: ${area_sqft} sqft
      - Floors: ${floors}
      - City: ${city}
      - Finish: ${finishingLevel}
      - Soil: ${soilType}
      - Basement: ${basement}

      JSON STRUCTURE REQUIRED:
      {
        "project_info": { "archetype": "${projectType}", "area_sqft": ${area_sqft}, "city": "${city}", "grade": "${finishingLevel}" },
        "structural_intelligence": {
          "recommended_structure": "string",
          "reasoning": "string",
          "cement_bags_est": number,
          "steel_tons_est": number,
          "sand_cu_m_est": number
        },
        "cost_summary": {
          "exterior_cost": number,
          "interior_cost": number,
          "contingency": number,
          "total_project_cost": number,
          "cost_per_sqft": number,
          "timeline_months": number
        },
        "material_summary": [
          { "material": "string", "qty": number, "unit": "string", "rate": number, "total": number }
        ]
      }`

    const parts: any[] = [{ text: systemPrompt + "\n" + userPrompt }]
    
    // Add images if present
    blueprintImages.forEach((imgBase64: string) => {
      if (imgBase64) {
        const cleanBase64 = imgBase64.split(',')[1] || imgBase64
        parts.push({
          inlineData: {
            mimeType: "image/png",
            data: cleanBase64
          }
        })
      }
    })

    // UPDATED MODELS BASED ON REAL API CAPABILITIES
    const modelsToTry = [
       "gemini-2.5-flash-lite", 
       "gemini-flash-latest", 
       "gemini-3-flash-preview", 
       "gemini-2.5-pro-preview"
    ]
    let lastError = null

    for (const model of modelsToTry) {
        try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
            const response = await fetch(geminiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: { response_mime_type: "application/json" }
              })
            })

            const result = await response.json()
            
            if (result.error) {
               lastError = `${model}: ${result.error.message}`
               console.error(`Attempt with ${model} failed:`, result.error.message)
               continue 
            }

            const candidate = result.candidates?.[0]
            if (!candidate || !candidate.content || !candidate.content.parts) {
               lastError = `${model}: Invalid structure`
               continue
            }

            const content = candidate.content.parts[0].text
            if (!content) continue
            
            return NextResponse.json(JSON.parse(content))
        } catch (e: any) {
            lastError = `${model}: ${e.message}`
            continue
        }
    }

    return NextResponse.json({ error: `AI Engine Failure: ${lastError || "All models failed"}` }, { status: 500 })

  } catch (error: any) {
    console.error("AI Estimate Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function getMockData(type: string, area_sqft: string, floors: string, city: string) {
  const area = parseInt(area_sqft || "3500")
  const rate = 2200
  const total = area * rate
  return {
    "project_info": { "archetype": type, "area_sqft": area, "city": city, "grade": "Luxury" },
    "structural_intelligence": {
      "recommended_structure": "RCC Framed Structure",
      "reasoning": "Standard residential load requirements.",
      "cement_bags_est": Math.round(area * 0.42),
      "steel_tons_est": Math.round(area * 0.0045),
      "sand_cu_m_est": Math.round(area * 0.05)
    },
    "cost_summary": {
      "exterior_cost": total * 0.65,
      "interior_cost": total * 0.35,
      "contingency": total * 0.05,
      "total_project_cost": total,
      "cost_per_sqft": rate,
      "timeline_months": 12
    },
    "material_summary": [
      { "material": "Cement OPC 53", "qty": Math.round(area * 0.42), "unit": "bags", "rate": 420, "total": Math.round(area * 0.42) * 420 },
      { "material": "TMT Steel Fe550", "qty": Math.round(area * 0.0045), "unit": "tons", "rate": 62000, "total": Math.round(area * 0.0045) * 62000 }
    ]
  }
}
