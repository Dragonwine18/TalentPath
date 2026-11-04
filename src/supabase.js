import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

// Example for profile writes after authentication is added:
// await supabase.from('profiles').upsert({ id: user.id, display_name, headline, location });
// Never place a service-role key in VITE_ variables or browser code.
