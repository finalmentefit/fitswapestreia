
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xyzcompany.supabase.co';  // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'public-anon-key';  // Replace with your Supabase public key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase };
