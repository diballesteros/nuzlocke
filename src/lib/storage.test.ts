import { requestPersistentStorage } from './storage';

describe('requestPersistentStorage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('asks for persistent storage when the browser supports it', () => {
    const persist = vi.fn().mockResolvedValue(true);
    vi.stubGlobal('navigator', { storage: { persist } });
    requestPersistentStorage();
    expect(persist).toHaveBeenCalledTimes(1);
  });

  test('ignores a rejected request', async () => {
    const persist = vi.fn().mockRejectedValue(new Error('denied'));
    vi.stubGlobal('navigator', { storage: { persist } });
    expect(() => requestPersistentStorage()).not.toThrow();
    await expect(persist.mock.results[0].value).rejects.toThrow('denied');
  });

  test('does nothing without a StorageManager or its persist method', () => {
    vi.stubGlobal('navigator', {});
    expect(() => requestPersistentStorage()).not.toThrow();
    vi.stubGlobal('navigator', { storage: {} });
    expect(() => requestPersistentStorage()).not.toThrow();
  });
});
