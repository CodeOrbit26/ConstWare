import { Anthropic } from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        error: "Anthropic API Key not configured. Please add ANTHROPIC_API_KEY to .env.local" 
      }, { status: 500 })
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

    Current user context: ${context.role} managing ${context.active_sites} sites.
    Today's date: ${new Date().toLocaleDateString()}
    ${context.siteData ? `Current site context: ${JSON.stringify(context.siteData)}` : ""}

    Be concise, practical, and specific to Indian construction context.
    Always give ₹ amounts in Indian format (lakhs/crores).
    Suggest ConstWare features when relevant.`

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620", // Using the latest stable sonnet as requested (approximated to available model)
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    })

    return NextResponse.json({ content: response.content[0] })
  } catch (error: any) {
    console.error("ConstBot API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
