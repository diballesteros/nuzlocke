import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import useStore from 'store';
import POKEMON from 'constants/pokemon';
import { TPokemon } from 'constants/types';
import styles from './Pokemon.module.scss';

interface PokemonProps {
  encounterId: number;
  pokemon: TPokemon;
}

const Pokemon: React.FC<PokemonProps> = React.memo(({ encounterId, pokemon }) => {
  const changePokemon = useStore((state) => state.changePokemon);
  const onChange = (e: unknown, selectedPokemon: TPokemon | string) => {
    if (typeof selectedPokemon !== 'string') {
      changePokemon(encounterId, selectedPokemon);
    }
  };

  return (
    <Autocomplete
      autoHighlight
      className={styles.pokemonSelect}
      classes={{ inputRoot: styles.pokemonSelect }}
      getOptionLabel={(option) => option.name}
      getOptionSelected={(option, value) => option.id === value.id}
      onChange={onChange}
      options={POKEMON}
      renderOption={(poke) => (
        <div className={styles.option}>
          <img src={poke.src} alt={poke.name} />
          {poke.name}
        </div>
      )}
      renderInput={(params) => (
        <div className={styles.label}>
          <TextField
            {...params}
            label="Pokémon..."
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
          {pokemon && <img src={pokemon?.src} alt={pokemon?.name} />}
        </div>
      )}
      value={pokemon}
    />
  );
});

export default Pokemon;
