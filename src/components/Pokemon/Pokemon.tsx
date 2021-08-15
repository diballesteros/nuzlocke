import React, { useCallback } from 'react';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import useStore from 'store';
import POKEMON from 'constants/pokemon';
import { TEncounter } from 'constants/types';
import { Evolve } from 'components';
import styles from './Pokemon.module.scss';

interface PokemonProps {
  alreadyEncountered: boolean;
  encounter: TEncounter;
}

const Pokemon: React.FC<PokemonProps> = React.memo(({ alreadyEncountered, encounter }) => {
  const changePokemon = useStore((state) => state.changePokemon);
  const showAll = useStore(useCallback((state) => state.showAll, []));
  const onChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const foundPokemon = POKEMON.find((poke) => poke.value === data.value);
    changePokemon(encounter.id, foundPokemon);
  };

  return (
    <label className={styles.label}>
      <div className={styles.innerLabel}>Pokémon: {alreadyEncountered && <span>(Dupe)</span>}</div>
      <div className={styles.dropdownContainer}>
        <Dropdown
          aria-label="Pokémon selector"
          basic
          className={styles.pokemonSelect}
          data-testid={`pokemon-${encounter.id}`}
          fluid
          icon={alreadyEncountered ? 'exclamation triangle' : undefined}
          inline
          labeled
          lazyLoad
          onChange={onChange}
          options={
            encounter?.filter && !showAll
              ? POKEMON.filter((poke) => encounter?.filter?.includes(poke.text))
              : POKEMON
          }
          placeholder="Select..."
          search
          selection
          value={encounter.pokemon?.value ?? null}
        />
        <Evolve />
      </div>
    </label>
  );
});

export default Pokemon;
