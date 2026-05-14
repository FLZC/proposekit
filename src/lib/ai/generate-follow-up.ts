export function generateFollowUp(input: {
  scenario: "price_objection" | "scope_reduction" | "post_send_follow_up";
  clientName: string;
  proposalSummary: string;
}) {
  if (input.scenario === "price_objection") {
    return `Hi ${input.clientName}, thanks for the candid feedback. We can reduce scope while protecting the core outcome. Based on the current proposal, I recommend removing lower-priority items first and keeping the launch-critical pieces intact.`;
  }

  if (input.scenario === "scope_reduction") {
    return `Hi ${input.clientName}, I can revise the proposal around a smaller scope. I suggest keeping the highest-impact deliverables in phase one and moving the rest into a later option.`;
  }

  return `Hi ${input.clientName}, following up on the proposal I sent over. Happy to answer questions, adjust scope, or walk through the pricing options if that would help your team decide.`;
}
