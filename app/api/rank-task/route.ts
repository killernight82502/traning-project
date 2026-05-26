import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { DIFFICULTY_RANKS, DifficultyRank } from "@/lib/game-constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function fallbackRank(title: string, description: string): DifficultyRank {
  const text = (title + " " + (description || "")).toLowerCase();

  if (text.includes("build") || text.includes("create") || text.includes("develop") || text.includes("implement") || text.includes("deploy") || text.includes("launch")) return "A";
  if (text.includes("research") || text.includes("analyze") || text.includes("investigate") || text.includes("optimize") || text.includes("migrate") || text.includes("refactor")) return "B";
  if (text.includes("write") || text.includes("study") || text.includes("learn") || text.includes("practice") || text.includes("prepare") || text.includes("review") || text.includes("plan")) return "C";
  if (text.includes("read") || text.includes("organize") || text.includes("clean") || text.includes("update") || text.includes("fix") || text.includes("edit")) return "D";
  return "E";
}

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ rank: "E" });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_api_key_here") {
      const rank = fallbackRank(title, description || "");
      return NextResponse.json({ rank });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI that ranks tasks by difficulty for a gamified productivity app. The ranks are:
E = Trivial (e.g., read email, check notifications, quick chore under 5min)
D = Easy (e.g., read a chapter, light cleaning, simple edits)
C = Medium (e.g., study session, write a draft, organize files)
B = Hard (e.g., research project, code review, detailed analysis)
A = Very Hard (e.g., build a feature, create a presentation, complex problem-solving)
S = Extreme (e.g., launch a product, major refactor, deliver a critical project)

Reply with ONLY the single letter rank (E, D, C, B, A, or S).`
        },
        { role: "user", content: `Title: ${title}\nDescription: ${description || "N/A"}` },
      ],
      max_tokens: 10,
    });

    let rank = response.choices[0].message.content?.trim().toUpperCase() || "E";
    if (!["E", "D", "C", "B", "A", "S"].includes(rank)) rank = "E";

    return NextResponse.json({ rank });
  } catch (error: any) {
    return NextResponse.json({ rank: "E" });
  }
}
