import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { POKEMON } from 'constants/constant';
import styles from './Pokemon.module.scss';

const Selection: React.FC = () => {
  return (
    <Autocomplete
      autoHighlight
      className={styles.pokemonSelect}
      classes={{ inputRoot: styles.pokemonSelect }}
      options={POKEMON}
      getOptionLabel={(option) => option.name}
      renderOption={(poke) => (
        <div className={styles.option}>
          <img src={poke.src} alt={poke.name} />
          {poke.name}
        </div>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a pokemon"
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
};

export default Selection;
