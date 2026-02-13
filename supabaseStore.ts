
import { createClient } from '@supabase/supabase-js';
import { DEFAULT_SETTINGS } from './constants';

// Función crítica: Elimina la barra al final si existe, espacios, y asegura https
const cleanUrl = (url: string | undefined) => {
  if (!url) return "";
  let cleaned = url.trim();
  if (cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
};

const supabaseUrl = cleanUrl(DEFAULT_SETTINGS.supabaseUrl);
const supabaseKey = DEFAULT_SETTINGS.supabaseKey?.trim() || '';

console.log("Supabase Init:", { url: supabaseUrl, hasKey: !!supabaseKey });

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public',
      },
    }) 
  : null;

export async function loadStoreFromSupabase() {
  if (!supabase) {
    console.warn("Supabase client is null. Check constants.ts credentials.");
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('store_data')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      // PGRST116: Row not found (La tabla existe pero el ID 1 no, o está vacía)
      // 42P01: Relation does not exist (La tabla no existe en absoluto)
      console.warn(`Supabase load status: ${error.code} - ${error.message}`);
      
      // Devolvemos NULL explícitamente para que App.tsx sepa que no hay datos
      // y dispare la "Auto-Siembra" (Auto-Seeding).
      return null;
    }

    console.log("Data loaded successfully from Supabase");
    return data;
  } catch (e) {
    console.error('CRITICAL: Unexpected error loading from Supabase:', e);
    return null;
  }
}
