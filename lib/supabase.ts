// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Estas variables tienen que estar en tu archivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase en el archivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);