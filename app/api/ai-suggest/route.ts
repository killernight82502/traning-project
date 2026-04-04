import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { progress } = await req.json();

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_api_key_here") {
      const suggestions = [
        "Defeat 10 shadow monsters (Do 10 pushups)",
        "Study the ancient texts (Read 15 pages of a book)",
        "Clear the digital dungeon (Organize your inbox for 10 minutes)"
      ];
      const randomSuggest = suggestions[Math.floor(Math.random() * suggestions.length)];
      return NextResponse.json({ suggestion: `[MOCK SYSTEM] ${randomSuggest}` });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `You are the System from Solo Leveling. User progress so far: ${JSON.stringify(progress)}. Based on this, suggest 1-2 new specific quests for the player hunter. Keep it brief, gamified, and punchy.` },
      ],
    });

    return NextResponse.json({ suggestion: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
