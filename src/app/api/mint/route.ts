import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI with optional API key for development
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt } = body;
  
  try {
    // If no API key is available, return a mock response for development
    if (!openai) {
      return NextResponse.json({ 
        result: `Mock NFT metadata for: ${prompt}. This is a development fallback. Set OPENAI_API_KEY for full functionality.`,
        isMock: true 
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an NFT metadata generator." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
    });
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}