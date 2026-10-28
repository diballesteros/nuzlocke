#!/usr/bin/env node
// Agent-facing control CLI for the Nuzlocke Tracker. Run `node control-nuzlocke.mjs help`.
// A detached host process owns the Vite server and a Chromium with a CDP port; every other command
// connects over CDP, acts on the app's tab, prints one JSON object and exits.
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const SESSION = path.join(ROOT, 'verification', '.session');
const ARTIFACTS = path.join(ROOT, 'verification', 'artifacts');
const SEEDS = path.join(ROOT, 'verification', 'seeds');
const STATE_FILE = path.join(SESSION, 'state.json');
const CONSOLE_LOG = path.join(SESSION, 'console.jsonl');
const APP_PORT = Number(process.env.VERIFY_PORT ?? 3100);
const CDP_PORT = Number(process.env.VERIFY_CDP_PORT ?? 9333);
const BASE_URL = `http://127.0.0.1:${APP_PORT}`;
const STORE_KEY = 'pokemon-tracker';
const VIEWPORTS = { desktop: { width: 1280, height: 800 }, mobile: { width: 375, height: 812 } };

const HELP = `control-nuzlocke: drive the Nuzlocke Tracker for verification. Output is JSON.

Lifecycle
  launch [--prod] [--headed]   Start Vite on :${APP_PORT} (--prod: build + preview) and Chromium (CDP :${CDP_PORT})
  doctor                       Read-only health check. Run first, and after anything surprising
  cleanup                      Stop only what launch started. Evidence in verification/artifacts stays

State
  seed <name>                  Load verification/seeds/<name>.json into the app and reload (seeds: ${listSeeds().join(', ') || 'none yet'})
  state [--out <file>]         Print the persisted store (localStorage "${STORE_KEY}")
  reset                        Clear storage and reload

Drive
  goto <route>                 e.g. / rules stats builder calculator settings (leading / optional)
  click --testid <id> | --role <role> --name <name> | --text <text>
  pick <testid> <option>       Choose a dropdown option by visible text or 0-based index
  type <testid> <text>         Fill a text input (the element or its child <input>)
  press <key>                  e.g. Escape, Enter, Tab
  toggle <testid>              Click a checkbox, radio or toggle
  theme light|dark             Set the app's dark-mode setting
  viewport desktop|mobile      ${VIEWPORTS.desktop.width}x${VIEWPORTS.desktop.height} or ${VIEWPORTS.mobile.width}x${VIEWPORTS.mobile.height}
  wait-settle                  Wait for network idle and two animation frames

Evidence (written to verification/artifacts/)
  snapshot [--name <n>]        ARIA snapshot of the page (YAML)
  screenshot [--name <n>] [--full]
  console [--clear]            Console errors and warnings since launch (or the last --clear)
`;

function listSeeds() {
  return fs.existsSync(SEEDS)
    ? fs
        .readdirSync(SEEDS)
        .filter((f) => f.endsWith('.json'))
        .map((f) => f.replace(/\.json$/, ''))
    : [];
}

const out = (result) => {
  console.info(JSON.stringify(result, null, 2));
};

const fail = (error, hint) => {
  console.error(JSON.stringify({ ok: false, error, hint }, null, 2));
  process.exit(1);
};

const readState = () =>
  fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) : null;

const alive = (pid) => {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

const portOpen = (port) =>
  new Promise((resolve) => {
    const socket = net.connect(port, '127.0.0.1');
    socket.once('connect', () => {
      socket.end();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
  });

const waitFor = async (check, timeoutMs, what) => {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    if (await check()) return;
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Timed out after ${timeoutMs / 1000}s waiting for ${what}`);
};

// The pid and every descendant, from `ps`. Not a process-group kill: Vite shares the host's group
// (so -vitePid doesn't exist) and Playwright starts Chromium in a group of its own
const descendants = (pid) => {
  const children = new Map();
  for (const line of execFileSync('ps', ['-A', '-o', 'pid=,ppid='], { encoding: 'utf8' })
    .trim()
    .split('\n')) {
    const [child, parent] = line.trim().split(/\s+/).map(Number);
    children.set(parent, [...(children.get(parent) ?? []), child]);
  }
  const tree = [];
  const walk = (p) => {
    tree.push(p);
    (children.get(p) ?? []).forEach(walk);
  };
  walk(pid);
  return tree;
};

const signal = (pid, sig) => {
  try {
    process.kill(pid, sig);
  } catch {
    // Already gone
  }
};

const killTree = async (pid) => {
  if (!alive(pid)) return;
  if (process.platform === 'win32') {
    execFileSync('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore' });
    return;
  }
  // Collect the whole tree before signalling: orphans are reparented and would be lost
  const tree = descendants(pid);
  tree.forEach((p) => signal(p, 'SIGTERM'));
  try {
    await waitFor(() => !tree.some(alive), 5_000, 'processes to exit');
  } catch {
    tree.forEach((p) => signal(p, 'SIGKILL'));
  }
};

const flag = (args, name) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return undefined;
  const value = args[i + 1];
  return value === undefined || value.startsWith('--') ? true : value;
};

// The page the host opened; every command acts on it
const connect = async () => {
  const state = readState();
  if (!state || !alive(state.hostPid)) {
    fail('No running session', 'Run `launch` first (or `cleanup` then `launch` if it crashed)');
  }
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  // The host opens a single tab; use it wherever it has navigated to (goto brings it back)
  const page = browser.contexts().flatMap((c) => c.pages())[0];
  if (!page) fail('The app tab is gone', 'Run `cleanup` then `launch`');
  return { browser, page };
};

const withPage = async (fn) => {
  const { browser, page } = await connect();
  try {
    return await fn(page);
  } finally {
    // Disconnects this client only; the host keeps the browser running
    await browser.close();
  }
};

const appReady = (page) => page.locator('[data-testid="app"]').waitFor({ timeout: 30_000 });

const locate = (page, args) => {
  const testid = flag(args, 'testid');
  if (typeof testid === 'string') return page.locator(`[data-testid="${testid}"]`).first();
  const role = flag(args, 'role');
  if (typeof role === 'string') {
    const name = flag(args, 'name');
    return page.getByRole(role, typeof name === 'string' ? { name } : {}).first();
  }
  const text = flag(args, 'text');
  if (typeof text === 'string') return page.getByText(text).first();
  return fail(
    'No target given',
    'Use --testid <id>, --role <role> [--name <name>] or --text <text>'
  );
};

const storeVersion = () => {
  const source = fs.readFileSync(path.join(ROOT, 'src', 'store.ts'), 'utf8');
  return Number(source.match(/name: 'pokemon-tracker',\s*version: (\d+)/)?.[1]);
};

const artifactPath = (name, ext) => {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return path.join(ARTIFACTS, `${name ?? stamp}.${ext}`);
};

const commands = {
  help: () => console.info(HELP),

  // Internal: the long-lived owner of Vite and Chromium (started detached by launch)
  host: async (args) => {
    const prod = args.includes('--prod');
    const headed = args.includes('--headed');
    fs.mkdirSync(SESSION, { recursive: true });
    fs.writeFileSync(CONSOLE_LOG, '');
    // Vite's own bin through node: no npx or shell, so it behaves the same on Windows. Bound to
    // 127.0.0.1 because "localhost" can resolve to ::1 only, which the port check would miss
    const viteBin = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
    const viteLog = fs.openSync(path.join(SESSION, 'vite.log'), 'w');
    if (prod)
      execFileSync(process.execPath, [viteBin, 'build'], {
        cwd: ROOT,
        stdio: ['ignore', viteLog, viteLog],
      });
    const vite = spawn(
      process.execPath,
      [
        viteBin,
        ...(prod ? ['preview'] : []),
        '--host',
        '127.0.0.1',
        '--port',
        String(APP_PORT),
        '--strictPort',
      ],
      { cwd: ROOT, stdio: ['ignore', viteLog, viteLog] }
    );
    await waitFor(
      () => portOpen(APP_PORT),
      120_000,
      `Vite on :${APP_PORT} (see verification/.session/vite.log)`
    );
    const context = await chromium.launchPersistentContext(path.join(SESSION, 'profile'), {
      headless: !headed,
      viewport: VIEWPORTS.desktop,
      serviceWorkers: 'block',
      args: [`--remote-debugging-port=${CDP_PORT}`],
    });
    const page = context.pages()[0] ?? (await context.newPage());
    const log = (entry) => fs.appendFileSync(CONSOLE_LOG, `${JSON.stringify(entry)}\n`);
    page.on('console', (msg) => {
      if (['error', 'warning'].includes(msg.type())) log({ type: msg.type(), text: msg.text() });
    });
    page.on('pageerror', (error) => log({ type: 'pageerror', text: error.message }));
    await page.goto(BASE_URL);
    await appReady(page);
    fs.writeFileSync(
      STATE_FILE,
      JSON.stringify({ hostPid: process.pid, vitePid: vite.pid, prod, baseUrl: BASE_URL }, null, 2)
    );
    await new Promise(() => {});
  },

  launch: async (args) => {
    const state = readState();
    if (state && alive(state.hostPid)) {
      // Reusing a session started in the other mode would silently test the wrong build
      if (state.prod !== args.includes('--prod')) {
        fail(
          `A ${state.prod ? 'prod' : 'dev'} session is already running`,
          'Run `cleanup`, then `launch` again'
        );
      }
      return out({ ok: true, alreadyRunning: true, ...state });
    }
    if (await portOpen(APP_PORT)) {
      fail(`Port ${APP_PORT} is in use by another process`, 'Free it, or set VERIFY_PORT');
    }
    fs.mkdirSync(SESSION, { recursive: true });
    fs.rmSync(STATE_FILE, { force: true });
    const hostLog = fs.openSync(path.join(SESSION, 'host.log'), 'w');
    const host = spawn(process.execPath, [fileURLToPath(import.meta.url), 'host', ...args], {
      cwd: ROOT,
      detached: true,
      stdio: ['ignore', hostLog, hostLog],
    });
    host.unref();
    try {
      await waitFor(
        () => fs.existsSync(STATE_FILE) || !alive(host.pid),
        240_000,
        'the app to render'
      );
      if (!fs.existsSync(STATE_FILE)) throw new Error('The host process exited during startup');
    } catch (error) {
      await killTree(host.pid);
      fail(error.message, 'Read verification/.session/host.log and vite.log');
    }
    out({ ok: true, ...readState() });
  },

  doctor: async () => {
    const state = readState();
    const checks = {
      session: !!state,
      hostAlive: alive(state?.hostPid),
      viteAlive: alive(state?.vitePid),
      appPort: await portOpen(APP_PORT),
      cdpPort: await portOpen(CDP_PORT),
    };
    if (!Object.values(checks).every(Boolean)) {
      return fail({ checks }, 'Run `cleanup` then `launch`');
    }
    const report = await withPage(async (page) => {
      const appRendered = (await page.locator('[data-testid="app"]').count()) > 0;
      const stored = await page.evaluate((key) => localStorage.getItem(key), STORE_KEY);
      const persistedVersion = stored ? JSON.parse(stored).version : null;
      return { url: page.url(), appRendered, persistedVersion };
    });
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    const errors = fs
      .readFileSync(CONSOLE_LOG, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .filter((entry) => entry.type !== 'warning');
    const expectedVersion = storeVersion();
    const ok =
      report.appRendered &&
      (report.persistedVersion === null || report.persistedVersion === expectedVersion);
    out({
      ok,
      checks,
      ...report,
      expectedStoreVersion: expectedVersion,
      appVersion: pkg.version,
      mode: state.prod ? 'prod' : 'dev',
      consoleErrors: errors.length,
    });
    if (!ok) process.exit(1);
  },

  cleanup: async () => {
    const state = readState();
    if (state) {
      await killTree(state.hostPid);
      await killTree(state.vitePid);
    }
    fs.rmSync(STATE_FILE, { force: true });
    out({ ok: true, stopped: state ? [state.hostPid, state.vitePid] : [], evidence: ARTIFACTS });
  },

  seed: async ([name]) => {
    const file = path.join(SEEDS, `${name}.json`);
    if (!name || !fs.existsSync(file)) {
      fail(`Unknown seed "${name}"`, `Available: ${listSeeds().join(', ') || 'none'}`);
    }
    const data = fs.readFileSync(file, 'utf8');
    await withPage(async (page) => {
      await page.evaluate(([key, value]) => localStorage.setItem(key, value), [STORE_KEY, data]);
      await page.reload();
      await appReady(page);
    });
    out({ ok: true, seed: name });
  },

  state: async (args) => {
    const stored = await withPage((page) =>
      page.evaluate((key) => localStorage.getItem(key), STORE_KEY)
    );
    const target = flag(args, 'out');
    if (typeof target === 'string') fs.writeFileSync(target, stored ?? 'null');
    out(target ? { ok: true, out: target } : JSON.parse(stored ?? 'null'));
  },

  reset: async () => {
    await withPage(async (page) => {
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      await appReady(page);
    });
    out({ ok: true });
  },

  goto: async ([route = '/']) => {
    // Git Bash turns "/rules" into "C:/Program Files/Git/rules"; undo that, and accept "rules"
    const path_ = route.replace(/^[a-z]:\/.*?\/Git(?=\/)/i, '').replace(/^(?!\/)/, '/');
    const url = await withPage(async (page) => {
      await page.goto(new URL(path_, BASE_URL).href);
      await appReady(page);
      return page.url();
    });
    out({ ok: true, url });
  },

  click: async (args) => {
    await withPage((page) => locate(page, args).click());
    out({ ok: true });
  },

  pick: async ([testid, option]) => {
    if (!testid || option === undefined) fail('Usage: pick <testid> <option>');
    const picked = await withPage(async (page) => {
      const dropdown = page.locator(`[data-testid="${testid}"]`).first();
      await dropdown.click();
      // A portalled menu (the Combobox, most Selects) carries the test id plus "-options"
      const items = dropdown
        .getByRole('option')
        .or(page.locator(`[data-testid="${testid}-options"]`).getByRole('option'));
      const item = /^\d+$/.test(option)
        ? items.nth(Number(option))
        : items.filter({ hasText: option }).first();
      const text = (await item.innerText()).trim();
      await item.click();
      return text;
    });
    out({ ok: true, picked });
  },

  type: async ([testid, ...words]) => {
    if (!testid) fail('Usage: type <testid> <text>');
    await withPage((page) =>
      page
        .locator(
          `input[data-testid="${testid}"], textarea[data-testid="${testid}"], [data-testid="${testid}"] input`
        )
        .first()
        .fill(words.join(' '))
    );
    out({ ok: true });
  },

  press: async ([key]) => {
    await withPage((page) => page.keyboard.press(key));
    out({ ok: true });
  },

  toggle: async ([testid]) => {
    const checked = await withPage(async (page) => {
      const target = page.locator(`[data-testid="${testid}"]`).first();
      const label = target.locator('label');
      await ((await label.count()) ? label.first() : target).click();
      const input = target.locator('input');
      return (await input.count()) ? input.first().isChecked() : null;
    });
    out({ ok: true, checked });
  },

  theme: async ([mode]) => {
    if (!['light', 'dark'].includes(mode)) fail('Usage: theme light|dark');
    await withPage(async (page) => {
      await page.evaluate(
        ([key, dark]) => {
          const stored = JSON.parse(localStorage.getItem(key) ?? '{"state":{},"version":0}');
          stored.state.darkMode = dark;
          localStorage.setItem(key, JSON.stringify(stored));
        },
        [STORE_KEY, mode === 'dark']
      );
      await page.reload();
      await appReady(page);
    });
    out({ ok: true, theme: mode });
  },

  viewport: async ([name]) => {
    if (!VIEWPORTS[name]) fail(`Unknown viewport "${name}"`, 'Use desktop or mobile');
    await withPage((page) => page.setViewportSize(VIEWPORTS[name]));
    out({ ok: true, viewport: VIEWPORTS[name] });
  },

  'wait-settle': async () => {
    await withPage(async (page) => {
      await page.waitForLoadState('networkidle');
      await page.evaluate(
        () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
      );
    });
    out({ ok: true });
  },

  snapshot: async (args) => {
    const file = artifactPath(flag(args, 'name'), 'aria.yml');
    const yaml = await withPage((page) => page.locator('body').ariaSnapshot());
    fs.writeFileSync(file, yaml);
    out({ ok: true, file, lines: yaml.split('\n').length });
  },

  screenshot: async (args) => {
    const file = artifactPath(flag(args, 'name'), 'png');
    await withPage((page) => page.screenshot({ path: file, fullPage: !!flag(args, 'full') }));
    out({ ok: true, file });
  },

  console: async (args) => {
    const entries = fs.existsSync(CONSOLE_LOG)
      ? fs
          .readFileSync(CONSOLE_LOG, 'utf8')
          .split('\n')
          .filter(Boolean)
          .map((line) => JSON.parse(line))
      : [];
    if (args.includes('--clear')) fs.writeFileSync(CONSOLE_LOG, '');
    out({ ok: true, count: entries.length, entries });
  },
};

const [command = 'help', ...args] = process.argv.slice(2);
if (!commands[command]) fail(`Unknown command "${command}"`, 'Run `help` for the command list');
try {
  await commands[command](args);
} catch (error) {
  fail(error.message.split('\n')[0], 'Run `doctor`; if it fails, `cleanup` then `launch`');
}
