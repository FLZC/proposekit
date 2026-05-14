import { getSupabaseServiceClient } from "@/lib/supabase/server";

const DAILY_LIMIT = 10;

export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly retryAfterSeconds: number,
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

export async function checkExtractionRateLimit(userId: string): Promise<void> {
  const supabase = await getSupabaseServiceClient();

  // Count proposals created in the last 24 hours
  const { count: dailyCount, error: dailyError } = await supabase
    .from("proposal_projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  if (dailyError) {
    console.error("Rate limit daily check failed:", dailyError);
    return; // fail open — don't block the user on DB errors
  }

  if (dailyCount !== null && dailyCount >= DAILY_LIMIT) {
    throw new RateLimitError(
      `Daily limit of ${DAILY_LIMIT} extractions reached. Please try again tomorrow.`,
      86400,
    );
  }
}
