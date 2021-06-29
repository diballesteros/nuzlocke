import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import Add from '@material-ui/icons/Add';
import useStore from 'store';
import useDebounce from 'hooks/useDebounce';
import styles from './Options.module.scss';

const Options: React.FC = React.memo(() => {
  const text = useStore(useCallback((state) => state.text, []));
  const search = useStore(useCallback((state) => state.search, []));
  const resetAll = useStore(useCallback((state) => state.resetAll, []));
  const addEncounter = useStore(useCallback((state) => state.addEncounter, []));
  const [searchText, setSearchText] = useState(text);
  const debouncedValue = useDebounce<string>(searchText, 250);
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');

  useEffect(() => {
    search(debouncedValue);
  }, [debouncedValue, search]);

  const handleReset = () => {
    resetAll();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleAdd = () => {
    addEncounter(location);
    setOpen(false);
    setLocation('');
  };

  const handleClose = () => {
    setOpen(false);
    setLocation('');
  };

  return (
    <div className={styles.options}>
      <TextField
        className={styles.search}
        label="Press enter to search..."
        onChange={handleChange}
        value={searchText}
        type="search"
      />
      <div className={styles.buttons}>
        <Button
          className={styles.add}
          color="default"
          endIcon={<Add />}
          onClick={() => setOpen(true)}
          variant="contained"
        >
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Encounter</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the location name</DialogContentText>
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={location?.length === 0} onClick={handleAdd}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default Options;
