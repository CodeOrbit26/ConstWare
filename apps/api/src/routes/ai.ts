import { Router, Request, Response } from "express";
import { Anthropic } from "@anthropic-ai/sdk";

const router = Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// Helper mock for estimate
function getMockEstimateData(type: string, area_sqft: string, floors: string, city: string) {
  const area = parseInt(area_sqft || "3500");
  const rate = 2200;
  const total = area * rate;
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
  };
}

// 1. POST /api/ai/scan-document
router.post("/scan-document", async (req: Request, res: Response) => {
  try {
    const { image } = req.body;
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Anthropic API Key not configured." });
    }
    if (!image) {
      return res.status(400).json({ error: "No document image provided" });
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 2000,
      system: `You are ConstWare's AI Document Hub Engine. Extract structured data from this construction document (Invoice, Bill, Challan, or ID).
      
      Return ONLY valid JSON:
      {
        "doc_type": "string",
        "vendor": "string",
        "date": "string",
        "amount": number,
        "tax": number,
        "items": [{"name": "string", "qty": number, "total": number}],
        "summary": "string"
      }`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { 
                type: "base64", 
                media_type: "image/jpeg", 
                data: image.replace(/^data:image\/(png|jpeg|webp);base64,/, "")
              }
            },
            { type: "text", text: "Scan and extract data from this document." }
          ]
        }
      ]
    });

    const textContent = (response.content[0] as any).text;
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON");

    return res.json(JSON.parse(jsonMatch[0]));
  } catch (error: any) {
    console.error("AI Document Scan Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 2. POST /api/ai/estimate
router.post("/estimate", async (req: Request, res: Response) => {
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
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes('placeholder')) {
      return res.json(getMockEstimateData(projectType, area_sqft, floors, city));
    }

    const systemPrompt = `You are ConstWare's Enterprise AI Cost Estimation Engine for Indian construction (2025 rates). 
    Generate a COMPLETE, REALISTIC construction estimate for a project in ${city}. 
    Return ONLY valid JSON.
    Analyze the architectural floor plans if provided to refine quantities.`;

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
      }`;

    const parts: any[] = [{ text: systemPrompt + "\n" + userPrompt }];
    
    blueprintImages.forEach((imgBase64: string) => {
      if (imgBase64) {
        const cleanBase64 = imgBase64.split(',')[1] || imgBase64;
        parts.push({
          inlineData: {
            mimeType: "image/png",
            data: cleanBase64
          }
        });
      }
    });

    const modelsToTry = [
       "gemini-2.5-flash-lite", 
       "gemini-flash-latest", 
       "gemini-3-flash-preview", 
       "gemini-2.5-pro-preview"
    ];
    let lastError = null;

    for (const model of modelsToTry) {
        try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const response = await fetch(geminiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: { response_mime_type: "application/json" }
              })
            });

            const result: any = await response.json();
            
            if (result.error) {
               lastError = `${model}: ${result.error.message}`;
               console.error(`Attempt with ${model} failed:`, result.error.message);
               continue;
            }

            const candidate = result.candidates?.[0];
            if (!candidate || !candidate.content || !candidate.content.parts) {
               lastError = `${model}: Invalid structure`;
               continue;
            }

            const content = candidate.content.parts[0].text;
            if (!content) continue;
            
            return res.json(JSON.parse(content));
        } catch (e: any) {
            lastError = `${model}: ${e.message}`;
            continue;
        }
    }

    return res.status(500).json({ error: `AI Engine Failure: ${lastError || "All models failed"}` });
  } catch (error: any) {
    console.error("AI Estimate Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 3. POST /api/ai/analyze-dpr
router.post("/analyze-dpr", async (req: Request, res: Response) => {
  try {
    const { images } = req.body;
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Anthropic API Key not configured." });
    }
    if (!images || images.length === 0) {
      return res.status(400).json({ error: "No photos provided for analysis" });
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
    });

    const textContent = (response.content[0] as any).text;
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON");

    return res.json(JSON.parse(jsonMatch[0]));
  } catch (error: any) {
    console.error("AI DPR Analysis Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 4. POST /api/ai/interior-design
router.post("/interior-design", async (req: Request, res: Response) => {
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
    } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Anthropic API Key not configured." });
    }

    const systemPrompt = `You are India's top luxury interior designer. 
    Design the perfect interior for the specified project. 
    Return ONLY pure JSON. No markdown. No explanation.`;

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
    }`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    });

    const textContent = (response.content[0] as any).text;
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON from AI response");

    return res.json(JSON.parse(jsonMatch[0]));
  } catch (error: any) {
    console.error("Interior Design Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 5. POST /api/ai/analyze-site
router.post("/analyze-site", async (req: Request, res: Response) => {
  try {
    const { images, analysis_type } = req.body;
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Anthropic API Key not configured." });
    }
    if (!images || images.length === 0) {
      return res.status(400).json({ error: "No images provided" });
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
    });

    const textContent = (response.content[0] as any).text;
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON from AI response");

    return res.json(JSON.parse(jsonMatch[0]));
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 6. POST /api/ai/analyze-blueprint
router.post("/analyze-blueprint", async (req: Request, res: Response) => {
  try {
    const { floorImages, plotArea, buildingUse, city } = req.body;
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Anthropic API Key not configured." });
    }

    const systemPrompt = `You are a master architect and 3D visualization expert.
    Analyze the provided floor plan images (one per floor) and return ONLY valid JSON. 
    No markdown. No explanation. No surrounding text.`;

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
            }
          ]
        }`
      }
    ];

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 6000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt as any }]
    });

    const textContent = (response.content[0] as any).text;
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON from AI response");

    return res.json(JSON.parse(jsonMatch[0]));
  } catch (error: any) {
    console.error("Blueprint Analysis Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 7. POST /api/ai/constbot
router.post("/constbot", async (req: Request, res: Response) => {
  try {
    const { messages, context } = req.body;
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: "Anthropic API Key not configured." });
    }

    const systemPrompt = `You are ConstBot, an expert construction AI assistant built into 
    ConstWare platform for Indian contractors. You have deep knowledge of:
    - Indian construction methods, materials, costs (2025 rates)
    - Labour laws, wage regulations for construction workers
    - Building codes and IS standards
    - Site management best practices
    - Hindi/English bilingual responses (match user's language)
    - GST rates on construction materials
    - Seasonal considerations (monsoon planning etc.)

    Current user context: ${context?.role || "contractor"} managing ${context?.active_sites || 0} sites.
    Today's date: ${new Date().toLocaleDateString()}
    ${context?.siteData ? `Current site context: ${JSON.stringify(context.siteData)}` : ""}

    Be concise, practical, and specific to Indian construction context.
    Always give ₹ amounts in Indian format (lakhs/crores).
    Suggest ConstWare features when relevant.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    });

    return res.json({ content: response.content[0] });
  } catch (error: any) {
    console.error("ConstBot API Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
