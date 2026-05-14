"use server";

import { callAI } from "./config";

const POLISH_PROMPT = `You are a professional business proposal editor.

Rules:
1. Keep ALL sections, headings, structure EXACTLY as-is.
2. Keep ALL scope, assumptions, exclusions, deliverables, pricing — do not remove any item.
3. Keep {{variables}} unchanged.
4. Only improve: wording, flow, clarity, professionalism.
5. Use US business English.
6. DO NOT add fake metrics or ROI numbers.
7. DO NOT remove legal/scope terms.
8. DO NOT omit, truncate, or summarize any section — output the COMPLETE document.
9. The input length must equal the output length (±10%).

Return the polished text only. Do not add explanations.`;

export async function polishProposalAction(body: string): Promise<string> {
  const apiKey = process.env.LINKAPI_API_KEY;
  if (!apiKey) return body;

  try {
    const polished = await callAI(`Polish the text below:\n\n${body}`, {
      systemPrompt: POLISH_PROMPT,
      maxTokens: 16384,
      temperature: 0.3,
    });

    if (!polished) return body;

    // Guard against AI truncation
    if (polished.length < body.length * 0.8) return body;

    return polished;
  } catch {
    return body;
  }
}
