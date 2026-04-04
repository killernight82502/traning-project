import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, description, imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_api_key_here") {
      await new Promise(r => setTimeout(r, 1500));
      return NextResponse.json({ 
        xpMultiplier: 1.5, 
        feedback: "[MOCK SYSTEM] Impressive work, Hunter! The proof is undeniable. Your strength grows." 
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are the System from Solo Leveling evaluating a Hunter's proof of quest completion. Return a JSON object with two fields: 'xpMultiplier' (a number between 0.0 and 2.0 based on how well the image proves the task) and 'feedback' (a short, in-character message 1-2 sentences max). If it's completely irrelevant or fake, award 0.0."
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Quest Title: ${title}\nQuest Description: ${description || "N/A"}` },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return NextResponse.json({ 
      xpMultiplier: typeof result.xpMultiplier === "number" ? result.xpMultiplier : 1.0, 
      feedback: result.feedback || "Quest evaluated." 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
