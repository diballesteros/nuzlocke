import { registerServiceWorker } from './serviceWorker';

describe('registerServiceWorker', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const stubWorker = (register: ReturnType<typeof vi.fn>) =>
    vi.stubGlobal('navigator', { serviceWorker: { register } });

  test('registers the worker on load in production', () => {
    vi.stubEnv('PROD', true);
    const register = vi.fn().mockResolvedValue({});
    stubWorker(register);
    registerServiceWorker();
    expect(register).not.toHaveBeenCalled();
    window.dispatchEvent(new Event('load'));
    expect(register).toHaveBeenCalledWith('/sw.js', { scope: '/' });
  });

  test('logs a failed registration instead of leaving it unhandled', async () => {
    vi.stubEnv('PROD', true);
    const error = new Error('AbortError');
    const register = vi.fn().mockRejectedValue(error);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    stubWorker(register);
    registerServiceWorker();
    window.dispatchEvent(new Event('load'));
    await vi.waitFor(() =>
      expect(warn).toHaveBeenCalledWith('Service worker registration failed', error)
    );
  });

  test('does nothing outside production builds or without service workers', () => {
    vi.stubEnv('PROD', false);
    const register = vi.fn().mockResolvedValue({});
    stubWorker(register);
    registerServiceWorker();
    window.dispatchEvent(new Event('load'));
    expect(register).not.toHaveBeenCalled();
    vi.stubEnv('PROD', true);
    vi.stubGlobal('navigator', {});
    expect(() => registerServiceWorker()).not.toThrow();
  });
});
