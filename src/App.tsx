import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Dropdown,
  DropdownProps,
  Icon,
  Input,
  Menu,
  Modal,
} from 'semantic-ui-react';
import { AppState } from 'constants/types';
import { GAMES } from 'constants/constant';
import Tracker from 'components/Tracker/Tracker';
import useStore from 'store';
import styles from './App.module.scss';

const App: React.FC = () => {
  const appState = useStore((state) => state);
  const [open, setOpen] = useState(false);
  const [gameName, setGameName] = useState('');

  useEffect(() => {
    if (appState.darkMode) {
      document.documentElement.style.setProperty('--primary', '#666666');
      document.documentElement.style.setProperty('--secondary', '#333333');
      document.documentElement.style.setProperty('--badge', '#C395FE');
      document.documentElement.style.setProperty('--badgeflash', '#ffffff');
      document.documentElement.style.setProperty('--bgprimary', '#212121');
      document.documentElement.style.setProperty('--bgsecondary', '#333333');
      document.documentElement.style.setProperty('--contrast', '#FFFFFF');
    } else {
      document.documentElement.style.setProperty('--primary', '#D46A6A');
      document.documentElement.style.setProperty('--secondary', '#FFE8E8');
      document.documentElement.style.setProperty('--bgprimary', '#FFFFFF');
      document.documentElement.style.setProperty('--badge', '#D46A6A');
      document.documentElement.style.setProperty('--badgeflash', '#ffaaaa');
      document.documentElement.style.setProperty('--bgsecondary', '#F5F5F5');
      document.documentElement.style.setProperty('--contrast', '#333333');
    }
  }, [appState.darkMode]);

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
        } else {
          throw Error('Invalid');
        }
      } catch (error) {
        console.error(error);
      }
    };
  };

  const handleChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const foundGame = GAMES.find((game) => game.value === data.value);
    appState.selectGame(foundGame);
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
    <main className={styles.app}>
      <Menu attached="top" inverted={appState.darkMode}>
        <Dropdown item icon="wrench" simple>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
            <Dropdown.Item>
              <input className={styles.input} id="file-input" onChange={handleImport} type="file" />
              Import
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown
          className={styles.gameSelect}
          inline
          onChange={handleChange}
          placeholder="Choose a game"
          selection
          options={appState.gamesList}
          value={appState.selectedGame?.value ?? ''}
        />
        <Menu.Menu>
          <Modal
            closeOnDimmerClick
            open={open}
            trigger={
              <Button basic icon inverted={appState.darkMode} onClick={() => setOpen(true)}>
                <Icon name="plus" />
              </Button>
            }
          >
            <Modal.Header>Add Game</Modal.Header>
            <Modal.Content style={{ display: 'flex', flexFlow: 'column nowrap', gap: '5px' }}>
              Please enter the game name
              <Input onChange={(e, data) => setGameName(data.value)} value={gameName} />
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button disabled={gameName?.length === 0} onClick={handleAdd}>
                Save
              </Button>
            </Modal.Actions>
          </Modal>
        </Menu.Menu>
        <Menu.Menu position="right">
          <Button basic icon inverted={appState.darkMode} onClick={() => appState.toggleMode()}>
            <Icon name={appState.darkMode ? 'sun outline' : 'sun'} />
          </Button>
        </Menu.Menu>
      </Menu>
      <Container className={styles.container}>
        <Tracker />
      </Container>
    </main>
  );
};

export default App;
