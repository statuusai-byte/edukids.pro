declare module "@capacitor/core" {
  export const Capacitor: {
    /**
     * Returns true if running on a native platform (Android / iOS).
     * Your runtime may provide a different implementation — this is only for TypeScript.
     */
    isNativePlatform: () => boolean;
    // Backwards-compatible method name used in the codebase
    isNativePlatformSync?: () => boolean;
  };
}