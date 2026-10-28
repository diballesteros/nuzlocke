// Runs live only in localStorage, so ask the browser not to evict it under storage pressure.
// Fire and forget: the answer doesn't change anything, and older browsers have no StorageManager
export function requestPersistentStorage(): void {
  navigator.storage?.persist?.().catch((): void => undefined);
}
