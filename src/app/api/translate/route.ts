import { NextRequest } from "next/server";
import { callMiMoAPI, type ChatMessage } from "@/lib/mimo";

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLang, targetLang, preserveTone } = await request.json();

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are an expert multilingual translator powered by Xiaomi MiMo V2.5. Translate text accurately while:
- Preserving the original meaning, tone, and intent
- Handling idioms and cultural expressions appropriately
- Maintaining technical terminology when applicable
- Keeping proper names unchanged unless there's a standard translation

Provide the translation followed by any notes about cultural adaptations or ambiguous terms.`,
      },
      {
        role: "user",
        content: `Translate the following text from ${sourceLang || "Auto-detect"} to ${targetLang || "English"}.
${preserveTone ? "Preserve the original tone and style." : ""}

Text:
${text}`,
      },
    ];

    const reply = await callMiMoAPI(messages, undefined, 0.3, 4096);
    return Response.json({ translation: reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
