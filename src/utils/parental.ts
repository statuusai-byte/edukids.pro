// Parental PIN utilities — local-only, usando Web Crypto para hash.
const PIN_HASH_KEY = "edukids_parent_pin_hash";
const REQUIRE_PIN_KEY = "edukids_require_parent_pin";

async function hashString(text: string) {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function setParentPin(pin: string) {
  const h = await hashString(pin);
  localStorage.setItem(PIN_HASH_KEY, h);
}

export function removeParentPin() {
  localStorage.removeItem(PIN_HASH_KEY);
}

export async function verifyParentPin(pin: string) {
  const stored = localStorage.getItem(PIN_HASH_KEY);
  if (!stored) return false;
  const h = await hashString(pin);
  return h === stored;
}

export function hasParentPin() {
  return !!localStorage.getItem(PIN_HASH_KEY);
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