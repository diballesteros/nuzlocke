import React, { lazy, Suspense, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Wrench } from 'lucide-react';
import { Filter, Share } from 'components';
import { AddEncounter, ResetEncounters } from 'components/Tracker/elements';
import { POKEMAP } from 'constants/pokemon';
import { GAME_VERSIONS } from 'constants/versions';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import { BUTTON_ICON } from '@/components/ui/icons';
import { RADIUS } from '../buttons';

// Only three games have versions, so the menu is its own chunk, outside the main bundle's budget
const Version = lazy(() => import('../Version/Version'));

const Options = React.memo(function Options() {
  const navigate = useNavigate();
  const text = useStore(useCallback((state) => state.text, []));
  const search = useStore(useCallback((state) => state.search, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const games = useStore(useCallback((state) => state.games, []));
  const gens = useStore(useCallback((state) => state.gens, []));
  const setGens = useStore(useCallback((state) => state.setGens, []));
  const types = useStore(useCallback((state) => state.types, []));
  const setTypes = useStore(useCallback((state) => state.setTypes, []));

  const onSearchOptions = () => {
    navigate('/settings');
  };

  return (
    // The search row, with Share, Add and Reset at its end from 550px (below, they're in the FAB)
    <div className="flex w-full max-w-full items-center gap-(--spacing-2)">
      <Button
        aria-label="search-options"
        className={RADIUS}
        data-testid="search-options"
        onClick={onSearchOptions}
        size="icon"
        type="button"
      >
        <Wrench className={BUTTON_ICON} strokeWidth={2.5} />
      </Button>
      <div className="relative flex min-w-0 flex-1">
        <Filter
          darkMode={darkMode}
          values={{
            gens,
            search: text,
            setGens,
            setSearch: search,
            setTypes,
            types,
          }}
        />
      </div>
      {GAME_VERSIONS[selectedGame?.value] && (
        <Suspense fallback={null}>
          <Version />
        </Suspense>
      )}
      <div className="flex shrink-0 gap-(--spacing-2) max-sm:[display:none]">
        <Share
          disabled={!selectedGame}
          text={games[selectedGame?.value]?.encounters?.reduce(
            (str, enc, i) => {
              const foundPokemon = POKEMAP.get(enc.pokemon);
              return `${str}
      ${Number(i) + 1}. ${enc.location} - ${foundPokemon?.text || 'N/A'} - ${
        enc.status?.text || 'N/A'
      }`;
            },
            `Nuzlocke Encounter List
        `
          )}
          toolbar
        />
        <AddEncounter />
        <ResetEncounters />
      </div>
    </div>
  );
});

export default Options;
