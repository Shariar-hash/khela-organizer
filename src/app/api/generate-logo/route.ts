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
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());

    // Generate a prompt for logo description
    const finalPrompt = prompt || 
      `Create a professional sports tournament logo design description for "${tournamentName}". 
       Include colors, shapes, and sports elements. Make it modern and clean.`;

    // Use text model to generate logo description/concept
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(`
      You are a professional logo designer. Generate a detailed description for a tournament logo.
      
      Requirements:
      - Tournament Name: ${tournamentName || "Tournament"}
      - User's additional request: ${prompt || "None"}
      
      Provide:
      1. Logo concept description
      2. Suggested colors (hex codes)
      3. Key visual elements
      4. Typography suggestions
      
      Keep the description concise but detailed enough for a designer to recreate.
    `);

    const response = result.response;
    const logoDescription = response.text();

    // Generate a placeholder SVG logo based on the tournament name
    const colors = generateColors(tournamentName || "Tournament");
    const svgLogo = generateSVGLogo(tournamentName || "T", colors);

    return NextResponse.json({
      success: true,
      description: logoDescription,
      logoSvg: svgLogo,
      colors,
    });
  } catch (error) {
    console.error("Logo generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate logo" },
      { status: 500 }
    );
  }
}

// Generate colors based on name
function generateColors(name: string) {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const hue = hash % 360;
  const saturation = 70 + (hash % 20);
  const lightness = 45 + (hash % 15);
  
  return {
    primary: hslToHex(hue, saturation, lightness),
    secondary: hslToHex((hue + 30) % 360, saturation, lightness + 10),
    accent: hslToHex((hue + 180) % 360, saturation - 10, lightness + 20),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateSVGLogo(name: string, colors: { primary: string; secondary: string; accent: string }): string {
  const initial = name.charAt(0).toUpperCase();
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="90" fill="url(#grad1)" />
    <circle cx="100" cy="100" r="75" fill="white" opacity="0.1" />
    <text x="100" y="120" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
          text-anchor="middle" fill="white">${initial}</text>
    <circle cx="100" cy="100" r="88" fill="none" stroke="${colors.accent}" stroke-width="4" />
  </svg>`;
}
