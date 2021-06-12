import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import STATUSES from 'constants/status';
import styles from './Status.module.scss';

const Status: React.FC = () => {
  return (
    <Autocomplete
      autoHighlight
      className={styles.statusSelect}
      classes={{ inputRoot: styles.gameSelect }}
      options={STATUSES}
      getOptionLabel={(option) => option.name}
      renderOption={(option) => <>{option.name}</>}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a status"
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

export default Status;
