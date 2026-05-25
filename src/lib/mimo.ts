export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const API_BASE_URL = process.env.MIMO_API_BASE_URL || "https://api.xiaomimimo.com/v1";
const API_KEY = process.env.MIMO_API_KEY || "";
const DEFAULT_MODEL = process.env.MIMO_MODEL || "MiMo-V2.5-Reasoning";

export async function callMiMoAPI(
  messages: ChatMessage[],
  model?: string,
  temperature: number = 0.7,
  maxTokens: number = 4096
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiMo API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}
