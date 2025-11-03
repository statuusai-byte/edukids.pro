declare module "@capacitor-community/billing" {
  export enum ProductType {
    PAID_SUBSCRIPTION = "paid_subscription",
    IN_APP = "in_app",
  }

  export enum ErrorCode {
    USER_CANCELLED = 1,
    UNKNOWN = 999,
  }

  // Minimal transaction type
  export type Transaction = {
    finish: () => Promise<void>;
    [k: string]: any;
  };

  // Order result shape used in the app (simple discriminated helpers)
  export type OrderResult =
    | { isOk: () => true; ok: Transaction; isError: () => false }
    | { isOk: () => false; ok?: undefined; isError: () => true; error?: { code?: number } };

  export const CdvPurchase: {
    store: {
      verbosity?: number | string;
      LogLevel?: {
        DEBUG: number | string;
        INFO: number | string;
        WARN: number | string;
        ERROR: number | string;
      };
      register: (products: Array<{ type: ProductType; id: string; platform?: string }>) => void;
      initialize: () => Promise<void>;
      get: (sku: string, platform?: string) => any;
      order: (offer: any) => Promise<OrderResult>;
    };
  };
}