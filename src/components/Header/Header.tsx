import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import { GAMES } from 'constants/constant';
import Close from '@material-ui/icons/Close';
import Export from '@material-ui/icons/GetApp';
import Import from '@material-ui/icons/Publish';

import styles from './Header.module.scss';

const Header: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <div className={styles.header}>
      <Autocomplete
        autoHighlight
        className={styles.gameSelect}
        classes={{ inputRoot: styles.gameSelect }}
        options={GAMES}
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
      <div className={styles.buttons}>
        <Button color="default" variant="contained" endIcon={<Export />}>
          Export
        </Button>
        <Button color="default" variant="contained" endIcon={<Import />}>
          Import
        </Button>
        <Button color="default" variant="contained" endIcon={<Close />}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default Header;
