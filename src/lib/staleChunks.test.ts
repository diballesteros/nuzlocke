import { reloadOnStaleChunk } from '@/lib/staleChunks';

// Each test adds its own listener; window outlives them, so keep the previous ones out of the way
let listeners: EventListener[] = [];
const addEventListener = window.addEventListener.bind(window);

beforeEach(() => {
  sessionStorage.clear();
  vi.useFakeTimers({ now: 1_000_000, toFake: ['Date'] });
  vi.spyOn(window, 'addEventListener').mockImplementation((type, listener, options) => {
    if (type === 'vite:preloadError') listeners.push(listener as EventListener);
    addEventListener(type, listener, options);
  });
});

afterEach(() => {
  listeners.forEach((listener) => window.removeEventListener('vite:preloadError', listener));
  listeners = [];
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function failChunk(): Event {
  const event = new Event('vite:preloadError', { cancelable: true });
  window.dispatchEvent(event);
  return event;
}

describe('reloadOnStaleChunk', () => {
  it('reloads once when a chunk fails, and stops Vite throwing', () => {
    const reload = vi.fn();
    reloadOnStaleChunk(reload);
    const event = failChunk();
    expect(reload).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('lets the error through when the chunk still fails right after a reload', () => {
    const reload = vi.fn();
    reloadOnStaleChunk(reload);
    failChunk();
    vi.setSystemTime(1_000_000 + 9_000);
    const event = failChunk();
    expect(reload).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(false);
  });

  it('reloads again for a later deploy', () => {
    const reload = vi.fn();
    reloadOnStaleChunk(reload);
    failChunk();
    vi.setSystemTime(1_000_000 + 60_000);
    failChunk();
    expect(reload).toHaveBeenCalledTimes(2);
  });

  it('does nothing without sessionStorage, which could not stop a reload loop', () => {
    const reload = vi.fn();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    reloadOnStaleChunk(reload);
    const event = failChunk();
    expect(reload).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it('ignores other events', () => {
    const reload = vi.fn();
    reloadOnStaleChunk(reload);
    window.dispatchEvent(new Event('error'));
    expect(reload).not.toHaveBeenCalled();
  });
});
