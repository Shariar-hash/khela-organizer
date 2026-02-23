import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

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

    // Build the prompt for logo generation
    const imagePrompt = prompt || 
      `Create a professional sports tournament logo for "${tournamentName || 'Tournament'}". 
       Modern, clean design with bold colors. Sports themed.
       Simple iconic design suitable for a tournament badge or team logo.
       High quality, vector-style logo on transparent or solid background.`;

    // Use Imagen 3 via REST API
    const imagenResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey.trim()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [{ prompt: imagePrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            personGeneration: "dont_allow",
            safetySetting: "block_medium_and_above",
          },
        }),
      }
    );

    if (!imagenResponse.ok) {
      const errorData = await imagenResponse.json().catch(() => ({}));
      console.error("Imagen API error:", imagenResponse.status, errorData);
      throw new Error(`Imagen API error: ${imagenResponse.status}`);
    }

    const imagenData = await imagenResponse.json();
    
    // Extract the generated image
    const predictions = imagenData.predictions || [];
    if (predictions.length > 0 && predictions[0].bytesBase64Encoded) {
      const base64Image = predictions[0].bytesBase64Encoded;
      const imageUrl = `data:image/png;base64,${base64Image}`;
      
      return NextResponse.json({
        success: true,
        description: `AI-generated logo for ${tournamentName || "Tournament"}`,
        imageUrl,
        logoSvg: null,
      });
    }

    throw new Error("No image generated");
  } catch (error: unknown) {
    console.error("Logo generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate logo", details: errorMessage },
      { status: 500 }
    );
  }
}

