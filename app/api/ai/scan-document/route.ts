import { Anthropic } from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        error: "Anthropic API Key not configured." 
      }, { status: 500 })
    }

    if (!image) {
      return NextResponse.json({ error: "No document image provided" }, { status: 400 })
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
    })

    const textContent = (response.content[0] as any).text
    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("Could not parse JSON")

    return NextResponse.json(JSON.parse(jsonMatch[0]))
  } catch (error: any) {
    console.error("AI Document Scan Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
