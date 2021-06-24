import React from 'react';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import Add from '@material-ui/icons/Add';
import useStore from 'store';
import styles from './Options.module.scss';

const Options: React.FC = () => {
  const { resetAll, search, text } = useStore((state) => state);

  const handleReset = () => {
    resetAll();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    search(e.target.value);
  };

  return (
    <div className={styles.options}>
      <TextField
        className={styles.search}
        label="Filter by pokémon, location or status"
        onChange={handleChange}
        value={text}
      />
      <div className={styles.buttons}>
        <Button className={styles.add} color="default" variant="contained" endIcon={<Add />}>
          Add Encounter
        </Button>
        <Button
          className={styles.clear}
          color="default"
          endIcon={<Close />}
          onClick={handleReset}
          variant="contained"
        >
          Reset All
        </Button>
      </div>
    </div>
  );
};

export default Options;
