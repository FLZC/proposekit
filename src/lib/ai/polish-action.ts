"use server";

const POLISH_PROMPT = `You are a professional business proposal editor.

Rules:
1. Keep ALL sections, headings, structure.
2. Keep ALL scope, assumptions, exclusions, deliverables, pricing.
3. Keep {{variables}} unchanged.
4. Only improve: wording, flow, clarity, professionalism.
5. Make it concise, US business English.
6. DO NOT add fake metrics or ROI numbers.
7. DO NOT remove legal/scope terms.

Return the polished text only. Do not add explanations.`;

export async function polishProposalAction(body: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return body;

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: POLISH_PROMPT },
          { role: "user", content: `Polish the text below:\n\n${body}` },
        ],
        max_tokens: 4000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) return body;
    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? body;
  } catch {
    return body;
  }
}
