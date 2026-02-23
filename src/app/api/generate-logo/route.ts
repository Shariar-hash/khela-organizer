import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, tournamentName } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    
    // Use Gemini 2.0 Flash with image generation capability
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      } as any,
    });

    // Build the prompt for logo generation
    const imagePrompt = prompt || 
      `Create a professional sports tournament logo for "${tournamentName || 'Tournament'}". 
       Modern, clean design with bold colors. Sports themed.
       Simple iconic design suitable for a tournament badge or team logo.
       High quality logo on a clean background.`;

    const result = await model.generateContent(imagePrompt);
    const response = result.response;
    
    // Extract image and text from response
    let imageUrl = "";
    let description = "";
    
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if ((part as any).inlineData) {
        const inlineData = (part as any).inlineData;
        imageUrl = `data:${inlineData.mimeType};base64,${inlineData.data}`;
      }
      if ((part as any).text) {
        description = (part as any).text;
      }
    }

    if (!imageUrl) {
      throw new Error("No image generated");
    }

    return NextResponse.json({
      success: true,
      description: description || `AI-generated logo for ${tournamentName || "Tournament"}`,
      imageUrl,
    });
  } catch (error: unknown) {
    console.error("Logo generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate logo", details: errorMessage },
      { status: 500 }
    );
  }
}

