import React, { useState } from 'react';
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
import styles from './Options.module.scss';

const Options: React.FC = React.memo(() => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');
  const { addEncounter, resetAll, search, text } = useStore((state) => state);

  const handleReset = () => {
    resetAll();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    search(e.target.value);
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
        label="Filter by pokémon, location or status"
        onChange={handleChange}
        value={text}
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
          <Button onClick={handleAdd}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default Options;
