import { NextRequest } from "next/server";
import { callMiMoAPI, type ChatMessage } from "@/lib/mimo";

export async function POST(request: NextRequest) {
  try {
    const { text, extractTypes } = await request.json();

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are an expert information extractor powered by Xiaomi MiMo V2.5. Extract structured data from unstructured text with high precision. Format your output as organized sections with clear labels.

For each extracted item, provide:
- The extracted value
- Confidence level (High/Medium/Low)
- Context from the original text`,
      },
      {
        role: "user",
        content: `Extract the following types of information from this text:
${extractTypes?.length ? extractTypes.join(", ") : "Names, Dates, Locations, Organizations, Emails, Phone Numbers, Key Facts, Numbers/Statistics"}

Text:
${text}`,
      },
    ];

    const reply = await callMiMoAPI(messages, undefined, 0.2, 4096);
    return Response.json({ extracted: reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
