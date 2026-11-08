// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  appRelease,
  markdownSection,
  nextVersion,
  parseChange,
  sortNotes,
  TYPES,
} from './release-lib.mjs';

const root = path.resolve(import.meta.dirname, '..');

describe('parseChange', () => {
  it('reads one paragraph as one note', () => {
    expect(parseChange('---\ntype: fix\n---\nFixed a\nwrapped line\n')).toEqual([
      { type: 'fix', description: 'Fixed a wrapped line' },
    ]);
  });

  it('reads a list as one note per item, with CRLF and wrapped items', () => {
    expect(parseChange('---\r\ntype: Feature\r\n---\r\n- One\r\n  more\r\n- Two\r\n')).toEqual([
      { type: 'feature', description: 'One more' },
      { type: 'feature', description: 'Two' },
    ]);
  });

  it.each([
    ['no front matter', 'Fixed it', /front matter/],
    ['an unknown type', '---\ntype: chore\n---\nx', /type must be one of/],
    ['no type', '---\n\n---\nx', /type must be one of/],
    ['an unknown field', '---\ntype: fix\nscope: x\n---\nx', /unknown field/],
    ['an unreadable line', '---\ntype fix\n---\nx', /can't read/],
    ['no note', '---\ntype: fix\n---\n\n', /no note/],
    ['a paragraph and a list', '---\ntype: fix\n---\nIntro\n- item', /not both/],
    ['an empty item', '---\ntype: fix\n---\n- \n- b', /empty list item/],
  ])('rejects %s', (_, text, message) => {
    expect(() => parseChange(text, 'x.md')).toThrow(message);
  });
});

describe('nextVersion', () => {
  it.each([
    ['major', '7.0.0'],
    ['minor', '6.2.0'],
    ['patch', '6.1.1'],
    ['6.3.0', '6.3.0'],
  ])('bumps 6.1.0 by %s to %s', (bump, version) => {
    expect(nextVersion('6.1.0', bump)).toBe(version);
  });

  it.each(['6.1.0', '6.0.9', 'next', undefined])('rejects %s', (bump) => {
    expect(() => nextVersion('6.1.0', bump)).toThrow();
  });

  it('rejects a current version that is not X.Y.Z', () => {
    expect(() => nextVersion('6.1', 'patch')).toThrow(/isn't X.Y.Z/);
  });
});

describe('a release', () => {
  const notes = [
    { type: 'fix', description: 'Fix 1' },
    { type: 'internal', description: 'CI' },
    { type: 'feature', description: 'Feature 1' },
    { type: 'fix', description: 'Fix 2' },
    { type: 'update', description: 'Update 1' },
  ];

  it('sorts notes by type and keeps their order within one', () => {
    expect(sortNotes(notes).map((note) => note.description)).toEqual([
      'Feature 1',
      'Update 1',
      'Fix 1',
      'Fix 2',
      'CI',
    ]);
  });

  it('becomes an in-app entry without internal notes', () => {
    expect(appRelease('6.2.0', 1, notes)).toEqual({
      name: 'Version 6.2.0',
      date: 1,
      notes: [
        { type: 'FEATURE', description: 'Feature 1' },
        { type: 'UPDATE', description: 'Update 1' },
        { type: 'FIX', description: 'Fix 1' },
        { type: 'FIX', description: 'Fix 2' },
      ],
    });
  });

  it('becomes a CHANGELOG.md section in its style', () => {
    expect(markdownSection('6.2.0', notes)).toBe(
      [
        '## Version 6.2.0',
        '',
        '🚀 New features',
        '',
        '- Feature 1',
        '',
        '💅 Enhancement',
        '',
        '- Update 1',
        '',
        '🐛 Bug Fix',
        '',
        '- Fix 1',
        '- Fix 2',
        '',
        '🏠 Internal',
        '',
        '- CI',
        '',
      ].join('\n')
    );
  });
});

describe('the repository', () => {
  it('has only change files that parse', () => {
    const files = readdirSync(path.join(root, '.changes')).filter(
      (name) => name.endsWith('.md') && name !== 'README.md'
    );
    for (const name of files) {
      expect(() =>
        parseChange(readFileSync(path.join(root, '.changes', name), 'utf8'), name)
      ).not.toThrow();
    }
  });

  it('has an in-app changelog in the shape the page reads, newest first', () => {
    const releases = JSON.parse(readFileSync(path.join(root, 'src/constants/releases.json')));
    const types = Object.values(TYPES)
      .map((type) => type.app)
      .filter(Boolean);
    const names = new Set();
    releases.forEach((release, i) => {
      expect(Object.keys(release).sort()).toEqual(['date', 'name', 'notes']);
      expect(release.name).toMatch(/^Version \d+\.\d+\.\d+$/);
      expect(names.has(release.name)).toBe(false);
      names.add(release.name);
      expect(Number.isInteger(release.date)).toBe(true);
      if (i > 0) expect(release.date).toBeLessThanOrEqual(releases[i - 1].date);
      expect(release.notes.length).toBeGreaterThan(0);
      for (const note of release.notes) {
        expect(Object.keys(note).sort()).toEqual(['description', 'type']);
        expect(types).toContain(note.type);
        expect(note.description.trim()).not.toBe('');
      }
    });
  });

  it('lists the current version as the latest release', () => {
    const { version } = JSON.parse(readFileSync(path.join(root, 'package.json')));
    const [latest] = JSON.parse(readFileSync(path.join(root, 'src/constants/releases.json')));
    expect(latest.name).toBe(`Version ${version}`);
  });
});
