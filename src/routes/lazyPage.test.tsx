import { act, render, screen } from '@testing-library/react';
import { Component, Suspense } from 'react';
import type { ReactNode } from 'react';
import lazyPage from 'routes/lazyPage';

function Hello({ name }: { name: string }) {
  return <p>Hello {name}</p>;
}

class Catch extends Component<{ children: ReactNode }, { error?: Error }> {
  state: { error?: Error } = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    return this.state.error ? <p>failed: {this.state.error.message}</p> : this.props.children;
  }
}

function renderPage(Page: React.ComponentType<{ name: string }>) {
  return render(
    <Catch>
      <Suspense fallback={<p>loading</p>}>
        <Page name="Ash" />
      </Suspense>
    </Catch>
  );
}

describe('lazyPage', () => {
  it('renders a preloaded page on its first try, without the fallback', async () => {
    const Page = lazyPage(async () => ({ default: Hello }));
    await Page.preload();
    renderPage(Page);
    expect(screen.getByText('Hello Ash')).toBeTruthy();
    expect(screen.queryByText('loading')).toBeNull();
  });

  it('suspends until a page that was not preloaded has loaded', async () => {
    let resolve: (module: { default: typeof Hello }) => void = () => {};
    const Page = lazyPage<{ name: string }>(() => new Promise((done) => (resolve = done)));
    // React retries a suspended render in tests only when both the render and the load's end
    // happen inside act()
    await act(async () => {
      renderPage(Page);
    });
    expect(screen.getByText('loading')).toBeTruthy();
    await act(async () => {
      resolve({ default: Hello });
      await Page.preload();
    });
    expect(screen.getByText('Hello Ash')).toBeTruthy();
  });

  it('loads once for every caller', async () => {
    const load = vi.fn(async () => ({ default: Hello }));
    const Page = lazyPage(load);
    const [first, second] = await Promise.all([Page.preload(), Page.preload()]);
    expect(first).toBe(Hello);
    expect(second).toBe(Hello);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('throws a failed load to the error boundary and loads again next time', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const load = vi
      .fn<() => Promise<{ default: typeof Hello }>>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue({ default: Hello });
    const Page = lazyPage(load);
    await expect(Page.preload()).rejects.toThrow('offline');
    await act(async () => {
      renderPage(Page);
    });
    expect(await screen.findByText('Hello Ash')).toBeTruthy();
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('waits while a stale chunk reloads the page', async () => {
    const Page = lazyPage<{ name: string }>(
      async () => undefined as unknown as { default: typeof Hello }
    );
    await act(async () => {
      renderPage(Page);
    });
    expect(screen.getByText('loading')).toBeTruthy();
    expect(screen.queryByText(/failed/)).toBeNull();
  });
});
