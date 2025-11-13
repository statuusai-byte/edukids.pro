/**
 * Runtime-capable Capacitor helper
 *
 * NOTE:
 * - We intentionally avoid importing "@capacitor/core" and the community plugins at module top-level
 *   because those packages are native-only and may not be installed in web/CI environments.
 * - At runtime, when running in a native container, these platform globals (Capacitor, AdMob, CdvPurchase)
 *   are expected to exist on globalThis. We access them via (globalThis as any) and provide safe fallbacks
 *   for web builds so bundlers do not attempt to resolve the native modules.
 *
 * Security improvement:
 * - Ad unit IDs are now read from Vite environment variables:
 *    VITE_ADMOB_INTERSTITIAL_ID
 *    VITE_ADMOB_REWARD_ID
 *
 *   This allows rotating IDs without changing source code and reduces the exposure of hardcoded IDs.
 */

import { showSuccess, showError } from "@/utils/toast";

/** Helpers to access native globals if available (fall back to no-op stubs) */
const nativeCapacitor = (globalThis as any).Capacitor;
const Capacitor = nativeCapacitor ?? { isNativePlatform: () => false, isNativePlatformSync: () => false };

const AdMobGlobal = (globalThis as any).AdMob;
const AdMob = AdMobGlobal ?? {
  initialize: async () => {},
  prepareInterstitial: async () => {},
  prepareRewardVideoAd: async () => {},
  showInterstitial: async () => {},
  showRewardVideoAd: async () => {},
  addListener: async (_eventName: string, _cb: (p?: any) => void) => ({ remove: () => {} }),
};

const CdvPurchaseGlobal = (globalThis as any).CdvPurchase;
const CdvPurchase = CdvPurchaseGlobal ?? {
  store: {
    verbosity: "DEBUG",
    register: (_products: Array<any>) => {},
    initialize: async () => {},
    get: (_sku: string, _platform?: string) => null,
    order: async (_offer: any) => ({ isOk: () => false, isError: () => true, error: { code: 999 } }),
  },
  // Provide LogLevel if some runtimes expose it via CdvPurchase
  LogLevel: {
    DEBUG: "DEBUG",
    INFO: "INFO",
    WARN: "WARN",
    ERROR: "ERROR",
  },
};

type AdOptions = { adId?: string; isTesting?: boolean; [k: string]: any };

/**
 * Read ad unit ids from environment variables (Vite):
 * - VITE_ADMOB_INTERSTITIAL_ID
 * - VITE_ADMOB_REWARD_ID
 *
 * If not provided, a fallback hardcoded id is used (kept for local dev convenience).
 * A warning is emitted in production when env vars are missing to encourage proper configuration.
 */
const DEFAULT_INTERSTITIAL_ID = "ca-app-pub-472017295403326f";
const DEFAULT_REWARDED_ID = "ca-app-pub-4720172954033263/2046840767";

const interstitialAdId = (import.meta as any).env?.VITE_ADMOB_INTERSTITIAL_ID ?? DEFAULT_INTERSTITIAL_ID;
const rewardAdId = (import.meta as any).env?.VITE_ADMOB_REWARD_ID ?? DEFAULT_REWARDED_ID;

// Warn in production when env vars are not set so ops/dev notice and can rotate IDs properly
if (!(import.meta as any).env?.VITE_ADMOB_INTERSTITIAL_ID && !(import.meta as any).env?.DEV) {
  console.warn(
    "[AdMob] VITE_ADMOB_INTERSTITIAL_ID not set — using fallback interstitial ad id. " +
      "Set VITE_ADMOB_INTERSTITIAL_ID in your environment for production."
  );
}
if (!(import.meta as any).env?.VITE_ADMOB_REWARD_ID && !(import.meta as any).env?.DEV) {
  console.warn(
    "[AdMob] VITE_ADMOB_REWARD_ID not set — using fallback rewarded ad id. " +
      "Set VITE_ADMOB_REWARD_ID in your environment for production."
  );
}

const interstitialOptions: AdOptions = {
  adId: interstitialAdId,
  isTesting: import.meta.env.DEV,
};

const rewardOptions: AdOptions = {
  adId: rewardAdId,
  isTesting: import.meta.env.DEV,
};

export const initializeAds = async () => {
  // Only initialize when running in native environment
  try {
    if (!Capacitor.isNativePlatform?.()) return;
    await AdMob.initialize({});
    await AdMob.prepareInterstitial(interstitialOptions);
    await AdMob.prepareRewardVideoAd(rewardOptions);
  } catch (e) {
    console.error("AdMob initialization failed", e);
  }
};

export const showInterstitialAd = async () => {
  if (!Capacitor.isNativePlatform?.()) {
    showSuccess("Anúncio Intersticial simulado exibido.");
    return;
  }
  try {
    await AdMob.showInterstitial();
    await AdMob.prepareInterstitial(interstitialOptions);
  } catch (e) {
    console.error("Failed to show interstitial ad", e);
  }
};

export const showRewardAd = (): Promise<boolean> => {
  return new Promise(async (resolve) => {
    if (!Capacitor.isNativePlatform?.()) {
      showSuccess("Anúncio Premiado simulado. Recompensa concedida!");
      resolve(true);
      return;
    }

    try {
      const rewardListener = await AdMob.addListener?.("rewarded", (reward: any) => {
        showSuccess(`Recompensa concedida: ${reward?.amount ?? 1} ${reward?.type ?? "item"}!`);
        resolve(true);
        rewardListener?.remove?.();
      });

      const failureListener = await AdMob.addListener?.("failedToLoad", () => {
        showError("Falha ao carregar o anúncio. Tente mais tarde.");
        resolve(false);
        failureListener?.remove?.();
      });

      await AdMob.showRewardVideoAd();
      await AdMob.prepareRewardVideoAd(rewardOptions);
    } catch (e) {
      console.error("Failed to show reward ad", e);
      resolve(false);
    }
  });
};

// ---------------- Billing helpers ----------------

export const initializeBilling = async () => {
  if (!Capacitor.isNativePlatform?.()) return;
  try {
    // Prefer LogLevel under the store if available, otherwise fallback to our stub
    const storeAny = (CdvPurchase as any).store ?? {};
    if (storeAny && storeAny.LogLevel && storeAny.LogLevel.DEBUG) {
      storeAny.verbosity = storeAny.LogLevel.DEBUG;
    } else if ((CdvPurchase as any).LogLevel && (CdvPurchase as any).LogLevel.DEBUG) {
      // Some runtimes expose LogLevel at top level
      storeAny.verbosity = (CdvPurchase as any).LogLevel.DEBUG;
    } else {
      storeAny.verbosity = "DEBUG";
    }

    storeAny.register?.([
      { type: "paid_subscription", id: "edukids-basic-monthly", platform: "google-play" },
    ]);
    await storeAny.initialize?.();
  } catch (e) {
    console.error("Billing initialization failed", e);
  }
};

export const purchaseProduct = async (sku: string): Promise<boolean> => {
  if (!Capacitor.isNativePlatform?.()) {
    showSuccess(`Compra de "${sku}" simulada com sucesso!`);
    return true;
  }

  try {
    const storeAny = (CdvPurchase as any).store;
    const product = storeAny?.get?.(sku, "google-play");
    if (!product || !product.offers) {
      showError("Produto não encontrado na loja.");
      return false;
    }
    const offer = product.offers[0];
    const result = await storeAny.order(offer);

    if (result?.isOk && result.isOk() && result.ok) {
      const transaction = result.ok;
      await transaction.finish();
      return true;
    }

    if (result?.isError && result.isError()) {
      // Access error field in a safe way (some runtimes place it on the result)
      const err = (result as any).error ?? (result as any);
      const code = err?.code ?? err?.errorCode;
      // 1 corresponds to USER_CANCELLED in our ambient types
      if (code === 1) {
        showError("Compra cancelada.");
        return false;
      }
      showError("Ocorreu um erro na compra.");
      return false;
    }

    showError("Ocorreu um erro na compra.");
    return false;
  } catch (e) {
    console.error("Purchase failed", e);
    showError("Falha ao processar a compra.");
    return false;
  }
};