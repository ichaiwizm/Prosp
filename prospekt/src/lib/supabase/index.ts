import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Export server-side Supabase client for server components
export { createClient } from "./server";

// Export client-side Supabase client for client components
export { supabase as browserClient } from "./client";

// Export middleware utilities
export { updateSession } from "./middleware";

// Server-side client for API routes (synchronous)
// This uses the anon key without cookies and without strict typing
// to avoid issues with Supabase client type inference
export function getSupabaseClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
