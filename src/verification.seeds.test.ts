// The verification seeds (verification/seeds, written by `npm run seeds`) are starting states for
// the control CLI, state goldens and visual baselines. They must load at the current persist
// version; when the store shape changes, bump the version, add the migration and regenerate them.
import fs from 'node:fs';
import path from 'node:path';
import type { AppState } from 'constants/types';
import useStore from 'store';

const SEEDS = path.join(__dirname, '..', 'verification', 'seeds');
const seeds = fs.readdirSync(SEEDS).filter((file) => file.endsWith('.json'));

describe('Verification seeds', () => {
  test('exist', () => {
    expect(seeds.map((file) => file.replace('.json', '')).sort()).toEqual([
      'custom-game',
      'empty',
      'game-selected',
      'light-mode',
      'mid-run',
    ]);
  });

  test.each(seeds)('%s is at the current persist version and rehydrates', async (file) => {
    const seed = JSON.parse(fs.readFileSync(path.join(SEEDS, file), 'utf8')) as {
      state: AppState;
      version: number;
    };
    expect(seed.version).toBe(useStore.persist.getOptions().version);

    localStorage.setItem(useStore.persist.getOptions().name, JSON.stringify(seed));
    await useStore.persist.rehydrate();

    const current = useStore.getState();
    expect(current.selectedGame).toEqual(seed.state.selectedGame);
    expect(current.games).toEqual(seed.state.games);
    expect(current.darkMode).toBe(seed.state.darkMode);
    localStorage.clear();
  });
});
