import React, { useState } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { GAMES } from 'constants/constant';
import Export from '@material-ui/icons/GetApp';
import Import from '@material-ui/icons/Publish';
import Add from '@material-ui/icons/Add';
import useStore from 'store';
import { AppState } from 'constants/types';
import styles from './Header.module.scss';

const Header: React.FC = React.memo(() => {
  const appState = useStore((state) => state);
  const [error, setError] = useState(false);

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
      JSON.stringify({ selectedGame: appState.selectedGame, games: appState.games })
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
        if (!!partialState?.games && !!partialState?.selectedGame) {
          appState.importState(partialState);
        } else {
          throw Error('Invalid');
        }
      } catch {
        setError(true);
      }
    };
  };

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <FormControl className={styles.gameSelect}>
          <InputLabel id="game-select">Choose a game</InputLabel>
          <Select id="game-select" onChange={handleChange} value={appState.selectedGame?.id ?? ''}>
            {GAMES.map((game) => {
              return (
                <MenuItem key={game.name} value={game.id}>
                  {game.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <IconButton aria-label="add game" color="inherit" className={styles.addIcon} edge="start">
          <Add />
        </IconButton>
      </div>
      <div className={styles.buttons}>
        {error && <span>Invalid file</span>}
        <Button color="default" variant="contained" endIcon={<Export />} onClick={handleExport}>
          Export
        </Button>
        <Button color="default" variant="contained" endIcon={<Import />}>
          Import
          <input className={styles.input} onChange={handleImport} type="file" />
        </Button>
      </div>
    </div>
  );
});

export default Header;
