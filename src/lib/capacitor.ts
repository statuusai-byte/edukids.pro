import { Capacitor } from "@capacitor/core";
import { AdMob, AdOptions, RewardAdPluginEvents } from "@capacitor-community/admob";
import { CdvPurchase, ProductType, ErrorCode } from "@capacitor-community/billing";
import { showSuccess, showError } from "@/utils/toast";

// --- AdMob Integration ---

const interstitialOptions: AdOptions = {
  adId: "ca-app-pub-472017295403326f", // Your Interstitial ID
  isTesting: import.meta.env.DEV,
};

const rewardOptions: AdOptions = {
  adId: "ca-app-pub-4720172954033263/2046840767", // Your Rewarded Ad ID
  isTesting: import.meta.env.DEV,
};

export const initializeAds = async () => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await AdMob.initialize({});
    // Pre-load ads
    await AdMob.prepareInterstitial(interstitialOptions);
    await AdMob.prepareRewardVideoAd(rewardOptions);
  } catch (e) {
    console.error("AdMob initialization failed", e);
  }
};

export const showInterstitialAd = async () => {
  if (!Capacitor.isNativePlatform()) {
    // Fallback for web
    showSuccess("Anúncio Intersticial simulado exibido.");
    return;
  }
  try {
    await AdMob.showInterstitial();
    await AdMob.prepareInterstitial(interstitialOptions); // Pre-load next
  } catch (e) {
    console.error("Failed to show interstitial ad", e);
  }
};

export const showRewardAd = (): Promise<boolean> => {
  return new Promise(async (resolve) => {
    if (!Capacitor.isNativePlatform()) {
      // Fallback for web
      showSuccess("Anúncio Premiado simulado. Recompensa concedida!");
      resolve(true);
      return;
    }

    // Use `any` for the callback payload to avoid importing unused types
    const rewardListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: any) => {
      showSuccess(`Recompensa concedida: ${reward.amount} ${reward.type}!`);
      resolve(true);
      rewardListener.remove();
    });

    const failureListener = await AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
      showError("Falha ao carregar o anúncio. Tente mais tarde.");
      resolve(false);
      failureListener.remove();
    });

    try {
      await AdMob.showRewardVideoAd();
      await AdMob.prepareRewardVideoAd(rewardOptions); // Pre-load next
    } catch (e) {
      console.error("Failed to show reward ad", e);
      resolve(false);
    }
  });
};

// --- Google Play Billing Integration ---

export const initializeBilling = async () => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    CdvPurchase.store.verbosity = CdvPurchase.LogLevel.DEBUG;
    CdvPurchase.store.register([
      { type: ProductType.PAID_SUBSCRIPTION, id: "edukids-basic-monthly", platform: "google-play" },
      // Add other products here if needed
    ]);
    await CdvPurchase.store.initialize();
  } catch (e) {
    console.error("Billing initialization failed", e);
  }
};

export const purchaseProduct = async (sku: string): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    // Fallback for web
    showSuccess(`Compra de "${sku}" simulada com sucesso!`);
    return true;
  }

  try {
    const product = CdvPurchase.store.get(sku, "google-play");
    if (!product || !product.offers) {
      showError("Produto não encontrado na loja.");
      return false;
    }
    const offer = product.offers[0];
    const result = await CdvPurchase.store.order(offer);
    if (result.isOk() && result.ok) {
      const transaction = result.ok;
      // In production: verify receipt on server. Here we finish the transaction locally.
      await transaction.finish();
      return true;
    } else if (result.isError() && result.error.code === ErrorCode.USER_CANCELLED) {
      showError("Compra cancelada.");
      return false;
    } else {
      showError("Ocorreu um erro na compra.");
      return false;
    }
  } catch (e) {
    console.error("Purchase failed", e);
    showError("Falha ao processar a compra.");
    return false;
  }
};