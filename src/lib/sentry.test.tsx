import { readFileSync } from 'node:fs';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { ROOT_ERROR_HANDLERS, SENTRY_OPTIONS, SENTRY_TUNNEL } from './sentry';

function Thrower({ error }: { error: Error }): React.JSX.Element {
  throw error;
}

function setup() {
  const sent: Sentry.ErrorEvent[] = [];
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  Sentry.init({
    dsn: 'https://key@o1.ingest.sentry.io/1',
    defaultIntegrations: false,
    beforeSend: (event) => {
      sent.push(event);
      return null;
    },
  });
  return sent;
}

function mechanism(event: Sentry.ErrorEvent) {
  const { values } = event.exception;
  return values[values.length - 1].mechanism;
}

async function renderInRoot(element: React.JSX.Element): Promise<void> {
  const root = createRoot(document.createElement('div'), ROOT_ERROR_HANDLERS);
  await act(async () => root.render(element));
}

describe('SENTRY_OPTIONS', () => {
  test('pins what stays off: IPs, user data, cookies, bodies', () => {
    expect(SENTRY_OPTIONS.dataCollection).toEqual({
      userInfo: false,
      cookies: false,
      httpHeaders: {
        request: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
        response: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
      },
      httpBodies: [],
      urlQueryParams: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
    });
  });

  test('tells the server not to infer IPs from the requests', () => {
    Sentry.init({ ...SENTRY_OPTIONS, dsn: 'https://key@o1.ingest.sentry.io/1' });
    const { settings } = Sentry.getClient().getOptions()._metadata.sdk;
    expect(settings.infer_ip).toBe('never');
    return Sentry.close();
  });

  test('the tunnel route forwards only to the DSN of the production build', () => {
    const [, host, project] = readFileSync('.env.production', 'utf8').match(
      /REACT_APP_SENTRY_DSN='https:\/\/\w+@([^/]+)\/(\d+)'/
    );
    const redirect = readFileSync('netlify.toml', 'utf8');
    expect(redirect).toContain(`from = "${SENTRY_TUNNEL}"`);
    expect(redirect).toContain(`to = "https://${host}/api/${project}/envelope/"`);
  });
});

describe('ROOT_ERROR_HANDLERS', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    await Sentry.close();
  });

  test('a Sentry boundary reports the error once, under the id it shows the dialog for', async () => {
    const sent = setup();
    const onError = vi.fn();
    await renderInRoot(
      <Sentry.ErrorBoundary fallback={<p>fallback</p>} onError={onError}>
        <Thrower error={new Error('caught by Sentry')} />
      </Sentry.ErrorBoundary>
    );
    expect(sent).toHaveLength(1);
    expect(mechanism(sent[0]).type).toBe('auto.function.react.error_boundary');
    expect(onError.mock.calls[0][2]).toBe(sent[0].event_id);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  test('reports an error caught by any other boundary as handled', () => {
    const sent = setup();
    const error = new Error('caught elsewhere');
    ROOT_ERROR_HANDLERS.onCaughtError(error, { componentStack: '\n at A' });
    expect(sent).toHaveLength(1);
    expect(mechanism(sent[0]).handled).toBe(true);
    expect(console.error).toHaveBeenCalledWith(error);
  });

  test('reports an uncaught error as unhandled', () => {
    const sent = setup();
    const error = new Error('uncaught');
    ROOT_ERROR_HANDLERS.onUncaughtError(error, { componentStack: '\n at A' });
    expect(sent).toHaveLength(1);
    expect(mechanism(sent[0]).handled).toBe(false);
    expect(console.error).toHaveBeenCalledWith(error);
  });

  test('reports a recoverable error as handled', () => {
    const sent = setup();
    const error = new Error('recoverable');
    ROOT_ERROR_HANDLERS.onRecoverableError(error, { componentStack: '\n at A' });
    expect(sent).toHaveLength(1);
    expect(mechanism(sent[0]).handled).toBe(true);
    expect(console.error).toHaveBeenCalledWith(error);
  });
});
