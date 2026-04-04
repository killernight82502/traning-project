import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_api_key_here") {
      const lower = (title + " " + (description || "")).toLowerCase();
      let type = "none";
      if (lower.includes("pushup") || lower.includes("run") || lower.includes("workout") || lower.includes("clean")) type = "physical";
      else if (lower.includes("read") || lower.includes("write") || lower.includes("study") || lower.includes("code")) type = "written";
      return NextResponse.json({ type });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an AI tasked with classifying quests. Classify the following task as either 'written' (requires a text document/essay/code screenshot as proof), 'physical' (requires a photo of a physical action like working out, cleaning, building something), or 'none' (digital task with no clear visual proof needed, like 'think about a problem' or 'read a book' where proof is impossible). Reply with strictly 'written', 'physical', or 'none'." 
        },
        { role: "user", content: `Title: ${title}\nDescription: ${description || "N/A"}` },
      ],
      max_tokens: 10,
    });

    const result = response.choices[0].message.content?.trim().toLowerCase() || "none";
    // Clean up result just in case there's punctuation
    let type = "none";
    if (result.includes("written")) type = "written";
    else if (result.includes("physical")) type = "physical";

    return NextResponse.json({ type });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
