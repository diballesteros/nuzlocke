import React, { useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Export from '@material-ui/icons/GetApp';
import Import from '@material-ui/icons/Publish';
import Add from '@material-ui/icons/Add';
import { GAMES } from 'constants/constant';
import { AppState } from 'constants/types';
import useStore from 'store';
import styles from './Header.module.scss';

const Header: React.FC = React.memo(() => {
  const appState = useStore((state) => state);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [gameName, setGameName] = useState('');

  const handleChange = (
    event: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>
  ) => {
    const foundGame = GAMES.find((game) => game.id === event.target.value);
    appState.selectGame(foundGame);
  };

  const handleExport = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({
        selectedGame: appState.selectedGame,
        games: appState.games,
        gamesList: appState.gamesList,
      })
    )}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'PokemonList.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (event) => {
      try {
        const partialState: Partial<AppState> = JSON.parse(event.target.result as string);
        if (!!partialState?.games && !!partialState?.selectedGame && !!partialState?.gamesList) {
          appState.importState(partialState);
          setError(false);
        } else {
          throw Error('Invalid');
        }
      } catch {
        setError(true);
      }
    };
  };

  const handleAdd = () => {
    appState.addGame(gameName);
    setOpen(false);
    setGameName('');
  };

  const handleClose = () => {
    setOpen(false);
    setGameName('');
  };

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <FormControl className={styles.gameSelect}>
          <InputLabel htmlFor="game-select">Choose a game</InputLabel>
          <Select id="game-select" onChange={handleChange} value={appState.selectedGame?.id ?? ''}>
            {appState.gamesList.map((game) => {
              return (
                <MenuItem key={game.name} value={game.id}>
                  {game.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <IconButton
          aria-label="add game"
          color="inherit"
          className={styles.addIcon}
          onClick={() => setOpen(true)}
          edge="start"
        >
          <Add />
        </IconButton>
      </div>
      <div className={styles.buttons}>
        {error && <span>Invalid file</span>}
        <Button color="default" variant="contained" endIcon={<Export />} onClick={handleExport}>
          Export
        </Button>
        <Button color="default" variant="contained" endIcon={<Import />}>
          <label htmlFor="file-input">
            Import
            <input className={styles.input} id="file-input" onChange={handleImport} type="file" />
          </label>
        </Button>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Game</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the game name</DialogContentText>
          <TextField
            margin="dense"
            label="Game"
            fullWidth
            onChange={(e) => setGameName(e.target.value)}
            value={gameName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={gameName?.length === 0} onClick={handleAdd}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default Header;
