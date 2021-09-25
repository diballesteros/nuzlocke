import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import useStore from 'store';
import useDebounce from 'hooks/useDebounce';
import POKEMON from 'constants/pokemon';
import { Share } from 'components';
import { AddEncounter, ResetEncounters } from 'components/Tracker/elements';
import styles from './Options.module.scss';

const Options: React.FC = React.memo(() => {
  const text = useStore(useCallback((state) => state.text, []));
  const search = useStore(useCallback((state) => state.search, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const games = useStore(useCallback((state) => state.games, []));
  const [searchText, setSearchText] = useState(text);
  const debouncedValue = useDebounce<string>(searchText, 250);

  useEffect(() => {
    search(debouncedValue);
  }, [debouncedValue, search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div className={styles.options}>
      <Input
        aria-label="search"
        className={styles.search}
        disabled={!selectedGame}
        fluid
        icon
        id="search-filter"
        inverted={darkMode}
        onChange={handleChange}
        placeholder="Filter encounters..."
        type="search"
        value={searchText}
      >
        <input />
        <Icon name="search" />
      </Input>
      <div className={styles.buttons}>
        <Share
          disabled={!selectedGame}
          text={games[selectedGame?.value]?.encounters?.reduce(
            (str, enc, i) => {
              const foundPokemon = POKEMON.find((poke) => poke.value === enc.pokemon);
              return `${str}
      ${i + 1}. ${enc.location} - ${foundPokemon?.text || 'N/A'} - ${enc.status?.text || 'N/A'}`;
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
