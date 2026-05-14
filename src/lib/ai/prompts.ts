export function jsonOnlyInstruction(schemaName: string) {
  return `Return JSON only. Do not add markdown. Produce an object matching ${schemaName}.`;
}
