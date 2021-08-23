import React, { useCallback, useMemo } from 'react';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import shallow from 'zustand/shallow';
import useStore from 'store';
import POKEMON from 'constants/pokemon';
import { TEncounter } from 'constants/types';
import { Evolve } from 'components';
import styles from './Pokemon.module.scss';

interface PokemonProps {
  encounter: TEncounter;
}

const Pokemon: React.FC<PokemonProps> = React.memo(({ encounter }) => {
  const changePokemon = useStore((state) => state.changePokemon);
  const duplicates = useStore(useCallback((state) => state.duplicates, []));
  const showAll = useStore(useCallback((state) => state.showAll, []));
  const games = useStore(useCallback((state) => state.games, []));
  const selectedGame = useStore(
    useCallback((state) => state.selectedGame, []),
    shallow
  );
  const foundPokemon = POKEMON.find((poke) => poke.value === encounter?.pokemon);
  const onChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    changePokemon(encounter.id, data.value as number);
  };

  const alreadyEncountered = useMemo(() => {
    return (
      duplicates &&
      !!encounter?.pokemon &&
      games[selectedGame?.value].encounters?.some((enc) => {
        return (
          enc?.pokemon === encounter?.pokemon &&
          enc.id !== encounter?.id &&
          enc?.status?.value !== 5 &&
          encounter?.status?.value !== 5
        );
      })
    );
  }, [duplicates, encounter, games, selectedGame]);

  const overSix = useMemo(() => {
    return (
      encounter?.status?.value === 7 &&
      games[selectedGame?.value].encounters?.filter((enc) => {
        return enc?.status?.value === 7;
      })?.length > 6
    );
  }, [encounter, games, selectedGame]);

  const alert = useMemo(() => {
    if (alreadyEncountered) {
      return 'DUPE';
    }
    if (overSix) {
      return 'TEAM OVER 6';
    }
    return false;
  }, [alreadyEncountered, overSix]);

  return (
    <label className={styles.label}>
      <div className={styles.innerLabel}>Pokémon: {!!alert && <span>{alert}</span>}</div>
      <div className={styles.dropdownContainer}>
        <Dropdown
          aria-label="Pokémon selector"
          basic
          className={styles.pokemonSelect}
          data-testid={`pokemon-${encounter.id}`}
          fluid
          inline
          labeled
          lazyLoad
          onChange={onChange}
          options={
            encounter?.filter && !showAll
              ? POKEMON.filter(
                  (poke) =>
                    encounter?.filter?.includes(poke.text) || encounter.pokemon === poke.value
                )
              : POKEMON
          }
          placeholder="Select..."
          search
          selection
          value={encounter.pokemon ?? null}
        />
        {!!foundPokemon?.evolve && (
          <Evolve encounter={encounter} evolveIds={foundPokemon?.evolve} />
        )}
      </div>
    </label>
  );
});

export default Pokemon;
