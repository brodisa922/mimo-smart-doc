import { NextRequest } from "next/server";
import { callMiMoAPI, type ChatMessage } from "@/lib/mimo";

export async function POST(request: NextRequest) {
  try {
    const { document, question, history } = await request.json();

    const systemMsg: ChatMessage = {
      role: "system",
      content: `You are an expert document analyst powered by Xiaomi MiMo V2.5. Answer questions about the provided document accurately and thoroughly.

Rules:
- Only answer based on information found in the document
- Quote relevant passages when possible
- If the answer is not in the document, say so clearly
- Provide concise but complete answers
- Use chain-of-thought reasoning for complex questions`,
    };

    const contextMsg: ChatMessage = {
      role: "user",
      content: `Here is the document to analyze:\n\n---\n${document}\n---`,
    };

    const assistantAck: ChatMessage = {
      role: "assistant",
      content: "I've read the document. Ask me anything about it.",
    };

    const messages: ChatMessage[] = [
      systemMsg,
      contextMsg,
      assistantAck,
      ...(history || []),
      { role: "user" as const, content: question },
    ];

    const reply = await callMiMoAPI(messages, undefined, 0.3, 4096);
    return Response.json({ answer: reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
