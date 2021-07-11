import React from 'react';
import useStore from 'store';
import POKEMON from 'constants/pokemon';
import { TPokemon } from 'constants/types';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import styles from './Pokemon.module.scss';

interface PokemonProps {
  encounterId: number;
  pokemon: TPokemon;
}

const Pokemon: React.FC<PokemonProps> = React.memo(({ encounterId, pokemon }) => {
  const changePokemon = useStore((state) => state.changePokemon);
  const onChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const foundPokemon = POKEMON.find((poke) => poke.value === data.value);
    changePokemon(encounterId, foundPokemon);
  };

  return (
    <Dropdown
      basic
      className={styles.pokemonSelect}
      fluid
      inline
      lazyLoad
      onChange={onChange}
      options={POKEMON}
      placeholder="Pokémon..."
      search
      selection
      value={pokemon?.value ?? null}
    />
  );
});

export default Pokemon;
