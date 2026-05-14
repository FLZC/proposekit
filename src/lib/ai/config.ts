const BASE_URL = process.env.LINKAPI_BASE_URL || "https://api.linkapi.ai/v1";
const PRIMARY_MODEL = process.env.AI_PRIMARY_MODEL || "gemini-2.5-flash-lite";
const FALLBACK_MODEL = process.env.AI_FALLBACK_MODEL || "gpt-5-nano";

export function getAIConfig(): { baseUrl: string; apiKey: string; primaryModel: string; fallbackModel: string } {
  return {
    baseUrl: BASE_URL,
    apiKey: process.env.LINKAPI_API_KEY || "",
    primaryModel: PRIMARY_MODEL,
    fallbackModel: FALLBACK_MODEL,
  };
}

export async function callAI(
  prompt: string,
  options: { systemPrompt?: string; maxTokens?: number; temperature?: number; retries?: number },
): Promise<string> {
  const config = getAIConfig();
  if (!config.apiKey) {
    throw new Error("No AI API key configured");
  }

  const models = [config.primaryModel, config.fallbackModel];
  const maxRetries = options.retries ?? 2;

  let lastError: Error | undefined;

  for (const model of models) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const messages: { role: string; content: string }[] = [];
        if (options.systemPrompt) {
          messages.push({ role: "system", content: options.systemPrompt });
        }
        messages.push({ role: "user", content: prompt });

        const response = await fetch(`${config.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            max_tokens: options.maxTokens ?? 4000,
            temperature: options.temperature ?? 0.3,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.choices?.[0]?.message?.content ?? "";
        }

        if (response.status === 429 && attempt < maxRetries) {
          const body = await response.text();
          const retryMatch = body.match(/retry in (\d+\.?\d*)s/);
          const delay = retryMatch ? Math.ceil(parseFloat(retryMatch[1]) * 1000) + 500 : (attempt + 1) * 2000;
          console.warn(`AI rate limited on ${model}, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        if (response.status >= 500 && attempt < maxRetries) {
          console.warn(`AI server error ${response.status} on ${model}, retrying (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise((r) => setTimeout(r, (attempt + 1) * 1000));
          continue;
        }

        // Non-retryable error — break inner loop, try next model
        const errorText = await response.text();
        lastError = new Error(`AI API error ${response.status} on ${model}: ${errorText.slice(0, 200)}`);
        break;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, (attempt + 1) * 1000));
          continue;
        }
      }
    }
  }

  throw lastError || new Error("AI call failed with all models");
}
