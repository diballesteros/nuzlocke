import React, { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { POKEMON } from 'constants/constant';
import { TPokemon } from 'constants/types';
import styles from './Pokemon.module.scss';

const Selection: React.FC = () => {
  const [value, setValue] = useState<TPokemon | null>(null);
  const onChange = (e: unknown, selectedPokemon: TPokemon | null) => {
    setValue(selectedPokemon);
  };

  return (
    <Autocomplete
      autoHighlight
      className={styles.pokemonSelect}
      classes={{ inputRoot: styles.pokemonSelect }}
      getOptionLabel={(option) => option.name}
      onChange={onChange}
      options={POKEMON}
      renderOption={(poke) => (
        <div className={styles.option}>
          <img src={poke.src} alt={poke.name} />
          {poke.name}
        </div>
      )}
      value={value}
      renderInput={(params) => (
        <div className={styles.label}>
          <TextField
            {...params}
            label="Choose a pokemon"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
          {value && <img src={value?.src} alt={value?.name} />}
        </div>
      )}
    />
  );
};

export default Selection;
