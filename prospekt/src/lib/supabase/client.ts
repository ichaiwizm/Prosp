import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use createBrowserClient from @supabase/ssr to properly handle cookies
// This ensures authentication state is synchronized between client and server
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
