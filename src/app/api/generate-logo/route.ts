import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { HfInference } from "@huggingface/inference";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, tournamentName } = body;

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey || !apiKey.trim()) {
      console.error("Hugging Face API key missing");
      return NextResponse.json(
        { error: "Hugging Face API key not configured" },
        { status: 500 }
      );
    }

    // Build the prompt for logo generation
    const imagePrompt = prompt || 
      `Professional sports tournament logo for "${tournamentName || 'Tournament'}", modern clean design, bold colors, sports themed, simple iconic design, tournament badge, high quality logo, clean background, vector style`;

    console.log("Generating logo with prompt:", imagePrompt.substring(0, 100) + "...");

    // Initialize the Hugging Face client
    const hf = new HfInference(apiKey.trim());

    // Generate the image using text-to-image
    const image = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: imagePrompt,
      parameters: {
        negative_prompt: "blurry, bad quality, distorted, ugly, text, watermark",
      },
    });

    console.log("Image generated, converting to base64...");

    // Convert Blob to base64
    const arrayBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    console.log("Logo generated successfully, size:", arrayBuffer.byteLength);

    return NextResponse.json({
      success: true,
      description: `AI-generated logo for ${tournamentName || "Tournament"}`,
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

