import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { Filter, Share } from 'components';
import { AddEncounter, ResetEncounters } from 'components/Tracker/elements';
import { POKEMAP } from 'constants/pokemon';
import useStore from 'store';
import styles from './Options.module.scss';

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
    <div className={styles.options}>
      <div className={styles.searchBar}>
        <Button
          aria-label="search-options"
          className={styles.searchBarButton}
          data-testid="search-options"
          icon="wrench"
          inverted={darkMode}
          onClick={onSearchOptions}
          type="button"
        />
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
      <div className={styles.buttons}>
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
        />
        <AddEncounter />
        <ResetEncounters />
      </div>
    </div>
  );
});

export default Options;
