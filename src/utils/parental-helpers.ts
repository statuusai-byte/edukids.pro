import { supabase } from "@/integrations/supabase/client";

const REQUIRE_PIN_KEY = "edukids_require_parent_pin";

/**
 * Checks if a parent PIN exists on the server for the current user.
 */
export async function hasParentPin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  try {
    // Note: This check is safe because RLS on 'parents' is set to allow authenticated users 
    // to SELECT their own row (auth.uid() = user_id).
    const { data, error } = await supabase
      .from('parents')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found

    return !!data;
  } catch (e) {
    console.error("Failed to check for parent pin existence", e);
    return false;
  }
}

export function requirePinForPurchasesGet(): boolean {
  try {
    return localStorage.getItem(REQUIRE_PIN_KEY) === "true";
  } catch {
    return false;
  }
}

export function requirePinForPurchasesSet(value: boolean) {
  try {
    localStorage.setItem(REQUIRE_PIN_KEY, value ? "true" : "false");
  } catch {
    // ignore
  }
}