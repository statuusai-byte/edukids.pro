declare module "@capacitor-community/admob" {
  export type AdOptions = {
    adId?: string;
    isTesting?: boolean;
    // allow arbitrary extra properties
    [key: string]: any;
  };

  export const AdMob: {
    initialize: (opts?: any) => Promise<void>;
    prepareInterstitial: (opts?: AdOptions) => Promise<void>;
    prepareRewardVideoAd: (opts?: AdOptions) => Promise<void>;
    showInterstitial: () => Promise<void>;
    showRewardVideoAd: () => Promise<void>;
    addListener: (eventName: string, callback: (payload?: any) => void) => {
      remove: () => void;
    };
  };

  export const RewardAdPluginEvents: {
    Rewarded: string;
    FailedToLoad: string;
    [k: string]: string;
  };
}