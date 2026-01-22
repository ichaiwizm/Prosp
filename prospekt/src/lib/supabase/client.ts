import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client without strict typing to avoid Supabase type inference issues
// The Database type definition causes issues with table recognition
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
