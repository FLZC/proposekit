"use server";

import { getCurrentUser } from "@/lib/supabase/server";

const demoFeedback: {
  id: string;
  user_id?: string;
  email?: string;
  message: string;
  page_url?: string;
  created_at: string;
}[] = [];

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function submitFeedback(formData: FormData) {
  const message = formData.get("message")?.toString().trim();
  const email = formData.get("email")?.toString().trim() || undefined;
  const pageUrl = formData.get("page_url")?.toString() || undefined;

  if (!message || message.length < 3) {
    return { error: "Please write at least 3 characters." };
  }

  let user;
  try {
    user = await getCurrentUser();
  } catch {
    // not authenticated, that's ok
  }

  if (!hasSupabaseConfig()) {
    const id = `fb_${Date.now()}`;
    demoFeedback.push({
      id,
      user_id: user?.id,
      email,
      message,
      page_url: pageUrl,
      created_at: new Date().toISOString(),
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[feedback]", message);
    }

    return { success: true, id };
  }

  try {
    const { createServerClient } = await import("@supabase/ssr");
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
        },
      },
    );

    const { error } = await supabase
      .from("user_feedback")
      .insert({
        user_id: user?.id,
        email,
        message,
        page_url: pageUrl,
      });

    if (error) return { error: error.message };
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
