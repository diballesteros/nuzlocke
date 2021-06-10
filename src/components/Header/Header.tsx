import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { GAMES } from 'constants/constant';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <div className={styles.header}>
      <Autocomplete
        style={{ width: 300 }}
        options={GAMES}
        autoHighlight
        getOptionLabel={(option) => option.name}
        renderOption={(option) => <>{option.name}</>}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a game"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
      <div>Buttons</div>
    </div>
  );
};

export default Header;
