// Pure helpers for scripts/release.mjs: change files in, a release entry and a CHANGELOG.md
// section out. See .changes/README.md for the change-file format.

// Types in the order a release lists them. `internal` goes to CHANGELOG.md only, not the app.
export const TYPES = {
  feature: { app: 'FEATURE', heading: '🚀 New features' },
  update: { app: 'UPDATE', heading: '💅 Enhancement' },
  fix: { app: 'FIX', heading: '🐛 Bug Fix' },
  internal: { app: null, heading: '🏠 Internal' },
};

const VERSION = /^(\d+)\.(\d+)\.(\d+)$/;

/**
 * Parses one change file: front matter with a `type`, then either one paragraph (one note) or a
 * list of `- ` items (one note each). Throws with the file name on anything else.
 */
export function parseChange(text, file = 'change file') {
  const match = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: expected front matter between --- lines`);
  const fields = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim()) continue;
    const field = line.match(/^(\w+):\s*(.*?)\s*$/);
    if (!field) throw new Error(`${file}: can't read front matter line "${line}"`);
    fields[field[1]] = field[2];
  }
  const unknown = Object.keys(fields).filter((key) => key !== 'type');
  if (unknown.length) throw new Error(`${file}: unknown field(s) ${unknown.join(', ')}`);
  const type = fields.type?.toLowerCase();
  if (!type || !(type in TYPES)) {
    throw new Error(`${file}: type must be one of ${Object.keys(TYPES).join(', ')}`);
  }

  const lines = match[2]
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) throw new Error(`${file}: no note after the front matter`);
  const isItem = (line) => /^-(\s|$)/.test(line);
  const listed = lines.filter(isItem);
  let notes;
  if (listed.length === 0) {
    notes = [lines.join(' ')];
  } else if (isItem(lines[0])) {
    // A list item may wrap onto following lines
    notes = [];
    for (const line of lines) {
      if (isItem(line)) notes.push(line.slice(1).trim());
      else notes[notes.length - 1] += ` ${line}`;
    }
  } else {
    throw new Error(`${file}: write one paragraph or a list of "- " items, not both`);
  }
  if (notes.some((note) => !note)) throw new Error(`${file}: empty list item`);
  return notes.map((description) => ({ type, description }));
}

/** The version after `current` for a bump of major, minor or patch, or an exact X.Y.Z. */
export function nextVersion(current, bump) {
  const parts = current.match(VERSION);
  if (!parts) throw new Error(`current version "${current}" isn't X.Y.Z`);
  const [major, minor, patch] = parts.slice(1).map(Number);
  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;
  if (bump === 'patch') return `${major}.${minor}.${patch + 1}`;
  const exact = bump?.match(VERSION);
  if (!exact) throw new Error(`bump must be major, minor, patch or X.Y.Z, not "${bump}"`);
  if (compareVersions(bump, current) <= 0) {
    throw new Error(`${bump} isn't later than the current ${current}`);
  }
  return bump;
}

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) if (pa[i] !== pb[i]) return pa[i] - pb[i];
  return 0;
}

/** Notes sorted by type (feature, update, fix, internal), keeping the given order within each. */
export function sortNotes(notes) {
  const order = Object.keys(TYPES);
  return notes
    .map((note, index) => ({ note, index }))
    .sort((a, b) => order.indexOf(a.note.type) - order.indexOf(b.note.type) || a.index - b.index)
    .map(({ note }) => note);
}

/** The in-app release entry (src/constants/releases.json), without internal notes. */
export function appRelease(version, date, notes) {
  return {
    name: `Version ${version}`,
    date,
    notes: sortNotes(notes)
      .filter((note) => TYPES[note.type].app)
      .map((note) => ({ type: TYPES[note.type].app, description: note.description })),
  };
}

/** The CHANGELOG.md section, in the file's existing style. */
export function markdownSection(version, notes) {
  const lines = [`## Version ${version}`, ''];
  for (const type of Object.keys(TYPES)) {
    const ofType = notes.filter((note) => note.type === type);
    if (!ofType.length) continue;
    lines.push(TYPES[type].heading, '');
    for (const note of ofType) lines.push(`- ${note.description}`);
    lines.push('');
  }
  return lines.join('\n');
}
