// Parental PIN utilities — uses Web Crypto to hash PIN and stores hash in localStorage.
// Note: This is a lightweight local-only parental gate. For production, prefer server-side parent-child linking and server-side checks.
const PIN_HASH_KEY = "edukids_parent_pin_hash";
const REQUIRE_PIN_KEY = "edukids_require_parent_pin";

const isBrowser = typeof window !== 'undefined';

async function hashString(text: string) {
  if (!isBrowser) return "";
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  // convert buffer to hex
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function setParentPin(pin: string) {
  if (!isBrowser) return;
  try {
    const h = await hashString(pin);
    localStorage.setItem(PIN_HASH_KEY, h);
  } catch (e) {
    console.error("Failed to set parent pin", e);
  }
}

export function removeParentPin() {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(PIN_HASH_KEY);
  } catch (e) {
    console.error("Failed to remove parent pin", e);
  }
}

export async function verifyParentPin(pin: string) {
  if (!isBrowser) return false;
  try {
    const stored = localStorage.getItem(PIN_HASH_KEY);
    if (!stored) return false;
    const h = await hashString(pin);
    return h === stored;
  } catch (e) {
    console.error("Failed to verify parent pin", e);
    return false;
  }
}

export function hasParentPin() {
  if (!isBrowser) return false;
  try {
    return !!localStorage.getItem(PIN_HASH_KEY);
  } catch {
    return false;
  }
}

export function requirePinForPurchasesGet(): boolean {
  if (!isBrowser) return false;
  try {
    return localStorage.getItem(REQUIRE_PIN_KEY) === "true";
  } catch {
    return false;
  }
}

export function requirePinForPurchasesSet(value: boolean) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(REQUIRE_PIN_KEY, value ? "true" : "false");
  } catch {
    // ignore
  }
}