// Parental PIN utilities — uses Supabase 'parents' table for secure storage.
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/context/SupabaseContext";
import { showError } from "./toast";

const REQUIRE_PIN_KEY = "edukids_require_parent_pin";

async function hashString(text: string) {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  // convert buffer to hex
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Sets or updates the parent PIN hash in the Supabase 'parents' table.
 * Requires the user to be logged in.
 */
export async function setParentPin(pin: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    showError("Você precisa estar logado para definir o PIN parental.");
    return;
  }
  try {
    const pinHash = await hashString(pin);
    
    const { error } = await supabase
      .from('parents')
      .upsert({ user_id: user.id, pin_hash: pinHash }, { onConflict: 'user_id' });

    if (error) throw error;
  } catch (e) {
    console.error("Failed to set parent pin in Supabase", e);
    showError("Falha ao salvar o PIN no servidor.");
  }
}

/**
 * Removes the parent PIN hash from the Supabase 'parents' table.
 * Requires the user to be logged in.
 */
export async function removeParentPin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    showError("Você precisa estar logado para remover o PIN parental.");
    return;
  }
  try {
    const { error } = await supabase
      .from('parents')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (e) {
    console.error("Failed to remove parent pin from Supabase", e);
    showError("Falha ao remover o PIN no servidor.");
  }
}

/**
 * Verifies the provided PIN against the hash stored on the server.
 * Uses a secure Edge Function to prevent client-side hash comparison.
 */
export async function verifyParentPin(pin: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    showError("Você precisa estar logado para verificar o PIN.");
    return false;
  }
  
  try {
    const pinHash = await hashString(pin);
    
    // Call the secure Edge Function for verification
    const { data, error } = await supabase.functions.invoke('verify-parent-pin', {
      method: 'POST',
      body: { pin_hash: pinHash },
    });

    if (error) throw error;

    return (data as { verified: boolean })?.verified === true;
  } catch (e) {
    console.error("Failed to verify parent pin securely", e);
    showError("Falha na comunicação com o servidor de PIN.");
    return false;
  }
}

/**
 * Checks if a parent PIN exists on the server for the current user.
 */
export async function hasParentPin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  try {
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