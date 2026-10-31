// The model's side of the triage: a manual tool loop and the only tools it ever gets. They read
// tracked files and public issues; editing tools exist only for the approved-fix job, which holds
// no write token. There is no shell tool.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { isFixablePath } from './lib.mjs';

export const MODEL = 'claude-opus-5-5';
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';
const MAX_RESULT_CHARS = 20000;
const MAX_LINE_CHARS = 300;
const READ_LINES = 400;

// Git gets no secrets from this process's environment
const git = (args) =>
  execFileSync('git', args, {
    encoding: 'utf8',
    env: { PATH: process.env.PATH },
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  });

const isHidden = (file) => /(^|\/)\.env/.test(file);
const trackedFiles = () => git(['ls-files']).split('\n').filter(Boolean);

const cut = (text) =>
  text.length > MAX_RESULT_CHARS
    ? `${text.slice(0, MAX_RESULT_CHARS)}\n[cut at ${MAX_RESULT_CHARS} characters: narrow the request]`
    : text;

const clip = (line) => (line.length > MAX_LINE_CHARS ? `${line.slice(0, MAX_LINE_CHARS)}…` : line);

const tool = (name, description, properties) => ({
  name,
  description,
  strict: true,
  input_schema: {
    type: 'object',
    additionalProperties: false,
    required: Object.keys(properties),
    properties,
  },
});

const READ_DEFINITIONS = [
  tool('search_issues', "Search this repository's issues, open and closed, for words.", {
    query: { type: 'string', description: 'A few words. Not GitHub search qualifiers.' },
  }),
  tool('search_code', 'Case-insensitive fixed-string search over tracked files.', {
    text: { type: 'string' },
  }),
  tool('list_files', 'List tracked files under a directory ("" for all).', {
    directory: { type: 'string' },
  }),
  tool('read_file', `Read up to ${READ_LINES} lines of a tracked file, from a 1-based line.`, {
    path: { type: 'string' },
    from_line: { type: 'integer' },
  }),
];

const EDIT_DEFINITIONS = [
  tool(
    'replace_in_file',
    'Replace text that occurs exactly once in a file under src/ or tests/e2e/.',
    {
      path: { type: 'string' },
      old_text: { type: 'string' },
      new_text: { type: 'string' },
    }
  ),
  tool('create_file', 'Create a new file under src/ or tests/e2e/.', {
    path: { type: 'string' },
    content: { type: 'string' },
  }),
];

// `searchIssues` returns [{ number, title, state, body }]; every number it returns goes in `seen`,
// so a review can only cite issues it really found.
export const buildTools = ({ searchIssues, canEdit = false, root = process.cwd() }) => {
  const seen = new Set();

  const readable = (file) => {
    if (isHidden(file) || !trackedFiles().includes(file)) {
      throw new Error(`Not a tracked file: ${file}`);
    }
    return file;
  };

  const editable = (file) => {
    if (!isFixablePath(file)) throw new Error(`Editing is limited to src/ and tests/e2e/: ${file}`);
    return path.join(root, file);
  };

  const handlers = {
    search_issues: async ({ query }) => {
      // Colons and quotes would make the words into qualifiers
      const issues = await searchIssues(String(query).replace(/[:"']/g, ' ').slice(0, 200));
      issues.forEach((issue) => seen.add(issue.number));
      return issues.length
        ? JSON.stringify(
            issues.map(({ number, title, state, body }) => ({
              number,
              title,
              state,
              body: (body ?? '').slice(0, 500),
            }))
          )
        : 'No issues found.';
    },
    search_code: ({ text }) => {
      try {
        const output = git([
          'grep',
          '-n',
          '-I',
          '-i',
          '-F',
          '--max-count=20',
          '-e',
          String(text),
          '--',
          ':(exclude).env*',
          ':(exclude)package-lock.json',
          ':(exclude)tests/data',
          ':(exclude)verification/seeds',
        ]);
        return cut(output.split('\n').map(clip).join('\n'));
      } catch (error) {
        if (error.status === 1) return 'No matches.';
        throw error;
      }
    },
    list_files: ({ directory }) => {
      const prefix = directory ? `${String(directory).replace(/\/$/, '')}/` : '';
      const files = trackedFiles().filter(
        (file) => file.startsWith(prefix) && !isHidden(file) && !file.includes('__baselines__')
      );
      return cut(files.join('\n')) || 'No files.';
    },
    read_file: ({ path: file, from_line: fromLine }) => {
      const lines = fs.readFileSync(path.join(root, readable(file)), 'utf8').split('\n');
      const start = Math.max(1, fromLine) - 1;
      const shown = lines.slice(start, start + READ_LINES).map(clip);
      const more = start + READ_LINES < lines.length;
      return cut(
        [
          ...shown.map((line, i) => `${start + i + 1}\t${line}`),
          ...(more ? [`[${lines.length} lines in all]`] : []),
        ].join('\n')
      );
    },
    ...(canEdit && {
      replace_in_file: ({ path: file, old_text: oldText, new_text: newText }) => {
        const full = editable(file);
        const text = fs.readFileSync(full, 'utf8');
        const count = oldText ? text.split(oldText).length - 1 : 0;
        if (count !== 1)
          throw new Error(`old_text occurs ${count} times in ${file}; it must be once.`);
        fs.writeFileSync(full, text.split(oldText).join(newText));
        return 'Replaced.';
      },
      create_file: ({ path: file, content }) => {
        const full = editable(file);
        if (fs.existsSync(full)) throw new Error(`${file} exists; use replace_in_file.`);
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, content);
        return 'Created.';
      },
    }),
  };

  return {
    seen,
    handlers,
    definitions: [...READ_DEFINITIONS, ...(canEdit ? EDIT_DEFINITIONS : [])],
  };
};

// After a server-side fallback, what the declined model produced before the switch goes back as
// text only.
const echoable = (content) => {
  const boundary = content.map((block) => block.type).lastIndexOf('fallback');
  return content.filter((block, i) => i > boundary || block.type === 'text');
};

// Runs the loop until the model answers with the schema's JSON. Returns { result } or, when the
// whole fallback chain declined, { refused: true }. The last turn takes the tools away, so the
// budget ends in an answer.
export const runLoop = async ({
  client,
  system,
  user,
  tools,
  schema,
  effort = 'medium',
  maxTurns = 12,
}) => {
  const messages = [{ role: 'user', content: user }];
  for (let turn = 1; turn <= maxTurns; turn += 1) {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: [FALLBACK_BETA],
      fallbacks: 'default',
      cache_control: { type: 'ephemeral' },
      system,
      tools: tools.definitions,
      tool_choice: { type: turn === maxTurns ? 'none' : 'auto' },
      output_config: { effort, format: { type: 'json_schema', schema } },
      messages,
    });
    console.info(
      `Turn ${turn}: ${response.stop_reason}, ${response.usage?.input_tokens ?? 0} in, ${response.usage?.output_tokens ?? 0} out`
    );

    if (response.stop_reason === 'refusal') return { refused: true };
    if (response.stop_reason === 'max_tokens') throw new Error('The answer hit max_tokens.');

    if (response.stop_reason !== 'tool_use') {
      const text = response.content.find((block) => block.type === 'text')?.text;
      if (!text) throw new Error(`No answer (stop reason ${response.stop_reason}).`);
      return { result: JSON.parse(text) };
    }

    messages.push({ role: 'assistant', content: echoable(response.content) });
    const results = [];
    for (const block of response.content.filter((b) => b.type === 'tool_use')) {
      const handler = tools.handlers[block.name];
      try {
        if (!handler) throw new Error(`Unknown tool: ${block.name}`);
        results.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: await handler(block.input),
        });
      } catch (error) {
        results.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: error.message,
          is_error: true,
        });
      }
    }
    messages.push({ role: 'user', content: results });
  }
  throw new Error(`No answer after ${maxTurns} turns.`);
};
