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
      classes={{ inputRoot: styles.gameSelect }}
      options={POKEMON}
      getOptionLabel={(option) => option.name}
      renderOption={(option) => <>{option.name}</>}
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
