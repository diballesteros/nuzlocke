// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { buildTools, MODEL, runLoop } from './claude.mjs';

const answer = (result) => ({
  stop_reason: 'end_turn',
  content: [{ type: 'text', text: JSON.stringify(result) }],
});
const call = (name, input, id = 'tool-1') => ({
  stop_reason: 'tool_use',
  content: [{ type: 'tool_use', id, name, input }],
});
const clientOf = (...responses) => {
  const create = vi.fn();
  responses.forEach((response) => create.mockResolvedValueOnce(response));
  return { client: { beta: { messages: { create } } }, create };
};
const loop = (client, tools, extra = {}) =>
  runLoop({ client, system: 'S', user: 'U', tools, schema: { type: 'object' }, ...extra });

describe('buildTools, read side', () => {
  const tools = buildTools({
    searchIssues: async (query) => [{ number: 5, title: query, state: 'open', body: 'b' }],
  });

  it('offers no editing or shell tool', () => {
    const names = tools.definitions.map((definition) => definition.name);
    expect(names).toEqual(['search_issues', 'search_code', 'list_files', 'read_file']);
    expect(tools.definitions.every((definition) => definition.strict)).toBe(true);
  });

  it('records the issues a search returned and strips search qualifiers', async () => {
    const result = JSON.parse(await tools.handlers.search_issues({ query: 'repo:other "x"' }));
    expect(result[0].title).toBe('repo other  x ');
    expect(tools.seen.has(5)).toBe(true);
  });

  it('reads tracked files only', () => {
    expect(tools.handlers.read_file({ path: 'package.json', from_line: 1 })).toContain('1\t{');
    expect(() => tools.handlers.read_file({ path: '../../etc/passwd', from_line: 1 })).toThrow(
      'Not a tracked file'
    );
    expect(() => tools.handlers.read_file({ path: '.env', from_line: 1 })).toThrow(
      'Not a tracked file'
    );
  });

  it('searches code as plain text and hides .env files', () => {
    expect(tools.handlers.search_code({ text: 'pokemon-tracker' })).toContain('src/store.ts');
    expect(tools.handlers.search_code({ text: ['$(touch', 'no-such-text)'].join(' ') })).toBe(
      'No matches.'
    );
    expect(tools.handlers.list_files({ directory: '' })).not.toMatch(/^\.env/m);
    expect(tools.handlers.list_files({ directory: 'verification/' })).toContain(
      'verification/areas.json'
    );
  });
});

describe('buildTools, edit side', () => {
  let root;
  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'triage-'));
    fs.mkdirSync(path.join(root, 'src'));
    fs.writeFileSync(path.join(root, 'src/a.ts'), 'one two two');
    fs.writeFileSync(path.join(root, 'package.json'), '{}');
  });
  afterEach(() => fs.rmSync(root, { recursive: true }));
  const edit = () => buildTools({ searchIssues: async () => [], canEdit: true, root }).handlers;

  it('is only there when asked for', () => {
    const { handlers } = buildTools({ searchIssues: async () => [] });
    expect(handlers.replace_in_file).toBeUndefined();
    expect(handlers.create_file).toBeUndefined();
  });

  it('replaces text that occurs exactly once', () => {
    edit().replace_in_file({ path: 'src/a.ts', old_text: 'one', new_text: 'three' });
    expect(fs.readFileSync(path.join(root, 'src/a.ts'), 'utf8')).toBe('three two two');
    expect(() =>
      edit().replace_in_file({ path: 'src/a.ts', old_text: 'two', new_text: 'x' })
    ).toThrow('occurs 2 times');
    expect(() => edit().replace_in_file({ path: 'src/a.ts', old_text: '', new_text: 'x' })).toThrow(
      'occurs 0 times'
    );
  });

  it('creates new files but never overwrites', () => {
    edit().create_file({ path: 'src/new/b.ts', content: 'b' });
    expect(fs.readFileSync(path.join(root, 'src/new/b.ts'), 'utf8')).toBe('b');
    expect(() => edit().create_file({ path: 'src/a.ts', content: 'x' })).toThrow('exists');
  });

  it.each(['package.json', '.github/workflows/x.yml', 'src/../package.json'])(
    'refuses to write %s',
    (file) => {
      expect(() => edit().create_file({ path: file, content: 'x' })).toThrow('limited');
      expect(() => edit().replace_in_file({ path: file, old_text: '{', new_text: 'x' })).toThrow(
        'limited'
      );
      expect(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).toBe('{}');
    }
  );
});

describe('runLoop', () => {
  const handler = vi.fn(async () => 'found');
  const tools = { definitions: [{ name: 'search_code' }], handlers: { search_code: handler } };
  beforeEach(() => {
    handler.mockClear();
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  it('asks for the current model, the schema and the fallback', async () => {
    const { client, create } = clientOf(answer({ ok: true }));
    await expect(loop(client, tools)).resolves.toEqual({ result: { ok: true } });
    const request = create.mock.calls[0][0];
    expect(request).toMatchObject({
      model: MODEL,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      tool_choice: { type: 'auto' },
      output_config: { effort: 'medium', format: { type: 'json_schema' } },
    });
    expect(request).not.toHaveProperty('thinking');
  });

  it('runs a tool and returns its result in the next turn', async () => {
    const { client, create } = clientOf(call('search_code', { text: 'x' }), answer({ ok: 1 }));
    await loop(client, tools);
    expect(handler).toHaveBeenCalledWith({ text: 'x' });
    const { messages } = create.mock.calls[1][0];
    expect(messages.at(-1)).toEqual({
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: 'tool-1', content: 'found' }],
    });
  });

  it('reports tool errors and unknown tools to the model, not the job', async () => {
    handler.mockRejectedValueOnce(new Error('boom'));
    const { client, create } = clientOf(
      call('search_code', { text: 'x' }),
      call('shell', { command: 'rm -rf /' }, 'tool-2'),
      answer({ ok: 1 })
    );
    await loop(client, tools);
    const { messages } = create.mock.calls[2][0];
    expect(messages[2].content[0]).toMatchObject({ is_error: true, content: 'boom' });
    expect(messages[4].content[0]).toMatchObject({
      is_error: true,
      content: 'Unknown tool: shell',
    });
  });

  it('takes the tools away on the last turn', async () => {
    const { client, create } = clientOf(call('search_code', { text: 'x' }), answer({ ok: 1 }));
    await loop(client, tools, { maxTurns: 2 });
    expect(create.mock.calls[1][0].tool_choice).toEqual({ type: 'none' });
  });

  it('fails when the budget ends without an answer', async () => {
    const { client } = clientOf(call('search_code', { text: 'x' }));
    await expect(loop(client, tools, { maxTurns: 1 })).rejects.toThrow('No answer after 1 turns');
  });

  it('returns refused on a refusal and fails on a cut-off answer', async () => {
    const refusal = clientOf({ stop_reason: 'refusal', content: [] });
    await expect(loop(refusal.client, tools)).resolves.toEqual({ refused: true });
    const cut = clientOf({ stop_reason: 'max_tokens', content: [] });
    await expect(loop(cut.client, tools)).rejects.toThrow('max_tokens');
  });

  it('echoes only text from before a fallback', async () => {
    const before = { type: 'text', text: 'partial' };
    const dropped = { type: 'tool_use', id: 'old', name: 'search_code', input: {} };
    const switched = { type: 'fallback', from: {}, to: {} };
    const after = { type: 'tool_use', id: 'new', name: 'search_code', input: {} };
    const { client, create } = clientOf(
      { stop_reason: 'tool_use', content: [before, dropped, switched, after] },
      answer({ ok: 1 })
    );
    await loop(client, tools);
    expect(create.mock.calls[1][0].messages[1].content).toEqual([before, after]);
  });
});
