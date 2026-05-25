import { NextRequest } from "next/server";
import { callMiMoAPI, type ChatMessage } from "@/lib/mimo";

export async function POST(request: NextRequest) {
  try {
    const { text, style, length } = await request.json();

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are an expert document summarizer powered by Xiaomi MiMo V2.5. Create clear, accurate summaries that capture the essence of the original text. Format your response as:

## Summary
A concise paragraph summarizing the main content.

## Key Takeaways
- Bullet points of the most important information

## Main Topics
- List of primary topics/themes covered

Adjust the summary based on the requested style and length.`,
      },
      {
        role: "user",
        content: `Summarize the following text.
Style: ${style || "Concise"}
Length: ${length || "Medium"}

Text:
${text}`,
      },
    ];

    const reply = await callMiMoAPI(messages, undefined, 0.3, 4096);
    return Response.json({ summary: reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
