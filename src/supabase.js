import { createClient } from '@supabase/supabase-js';

// Substitua pelos valores do seu projeto no Supabase
const SUPABASE_URL = 'https://xyzcompany.supabase.co';  // Substitua pela URL do seu projeto
const SUPABASE_ANON_KEY = 'public-anon-key';  // Substitua pela chave pública

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export { supabase };
