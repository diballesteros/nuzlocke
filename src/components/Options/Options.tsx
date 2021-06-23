import React from 'react';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import Add from '@material-ui/icons/Add';
import useStore from 'store';
import styles from './Options.module.scss';

const Options: React.FC = () => {
  const reset = useStore((state) => state.resetAll);
  const handleReset = () => {
    reset();
  };

  return (
    <div className={styles.options}>
      <div>Indicators</div>
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
