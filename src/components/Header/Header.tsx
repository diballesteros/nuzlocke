import React, { useContext } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { GAMES } from 'constants/constant';
import Close from '@material-ui/icons/Close';
import Export from '@material-ui/icons/GetApp';
import Import from '@material-ui/icons/Publish';
import Add from '@material-ui/icons/Add';
import AppContext from 'context/AppContext';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);

  const handleChange = (
    event: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>
  ) => {
    const foundGame = GAMES.find((game) => game.id === event.target.value);
    dispatch({ type: 'SELECT_GAME', payload: { game: foundGame } });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_ALL' });
  };

  return (
    <div className={styles.header}>
      <FormControl className={styles.gameSelect}>
        <InputLabel id="game-select">Choose a game</InputLabel>
        <Select id="game-select" onChange={handleChange} value={state.selectedGame?.id ?? ''}>
          {GAMES.map((game) => {
            return (
              <MenuItem key={game.name} value={game.id}>
                {game.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <div className={styles.buttons}>
        <Button color="default" variant="contained" endIcon={<Add />}>
          Add Encounter
        </Button>
        <Button className={styles.export} color="default" variant="contained" endIcon={<Export />}>
          Export
        </Button>
        <Button className={styles.import} color="default" variant="contained" endIcon={<Import />}>
          Import
        </Button>
        <Button
          className={styles.clear}
          color="default"
          onClick={handleReset}
          variant="contained"
          endIcon={<Close />}
        >
          Reset All
        </Button>
      </div>
    </div>
  );
};

export default Header;
