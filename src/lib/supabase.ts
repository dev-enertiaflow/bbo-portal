import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lfhrabqeflzvpqyowqhd.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmaHJhYnFlZmx6dnBxeW93cWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTM5NTkyOCwiZXhwIjoyMTA2OTcxOTI4fQ.419vCKWfE-NCK7ztllirnTD8hhsy0D0Cuv5U4vu5Os8";

// Server-side admin client strictly isolated to service_role with NO session persistence
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
export const supabase = supabaseAdmin;
