import React from 'react';
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
import styles from './Header.module.scss';

const Header: React.FC = React.memo(() => {
  const appState = useStore((state) => state);

  const handleChange = (
    event: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>
  ) => {
    const foundGame = GAMES.find((game) => game.id === event.target.value);
    appState.selectGame(foundGame);
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
        <Button color="default" variant="contained" endIcon={<Export />}>
          Export
        </Button>
        <Button color="default" variant="contained" endIcon={<Import />}>
          Import
        </Button>
      </div>
    </div>
  );
});

export default Header;
