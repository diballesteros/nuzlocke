import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Confirm,
  Container,
  Dropdown,
  DropdownProps,
  Icon,
  Input,
  Menu,
  Modal,
} from 'semantic-ui-react';
import useStore from 'store';
import { AppState } from 'constants/types';
import { About, BadgeEditor, Contact, Share, Tracker } from 'components';
import styles from './App.module.scss';

const App: React.FC = () => {
  const appState = useStore((state) => state);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [gameName, setGameName] = useState('');

  useEffect(() => {
    if (appState.darkMode) {
      document.documentElement.style.setProperty('--card', '#424242');
      document.documentElement.style.setProperty('--badge', '#C395FE');
      document.documentElement.style.setProperty('--badgeflash', '#ffffff');
      document.documentElement.style.setProperty('--bgprimary', '#212121');
      document.documentElement.style.setProperty('--bgsecondary', '#333333');
      document.documentElement.style.setProperty('--contrast', '#FFFFFF');
    } else {
      document.documentElement.style.setProperty('--card', '#ffffff');
      document.documentElement.style.setProperty('--bgprimary', '#FFFFFF');
      document.documentElement.style.setProperty('--badge', '#D46A6A');
      document.documentElement.style.setProperty('--badgeflash', '#ffaaaa');
      document.documentElement.style.setProperty('--bgsecondary', '#E2E1E0');
      document.documentElement.style.setProperty('--contrast', '#333333');
    }
  }, [appState.darkMode]);

  const handleExport = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({
        badges: appState.badges,
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
    const foundGame = appState.gamesList.find((game) => game.value === data.value);
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

  const handleRules = () => {
    window.open('https://bulbapedia.bulbagarden.net/wiki/Nuzlocke_Challenge', '_blank');
  };

  const handleDelete = () => {
    appState.deleteGame();
    setConfirm(false);
  };

  return (
    <main className={styles.app}>
      <Menu attached="top" inverted={appState.darkMode} style={{ width: '100%' }}>
        <Dropdown aria-label="options" data-testid="options" item icon="wrench" simple>
          <Dropdown.Menu>
            <Modal
              closeOnDimmerClick
              open={settings}
              trigger={
                <Dropdown.Item icon="options" onClick={() => setSettings(true)} text="Settings" />
              }
            >
              <Modal.Header>Settings</Modal.Header>
              <Modal.Content style={{ display: 'flex', flexFlow: 'column nowrap', gap: '5px' }}>
                <Checkbox
                  checked={appState.duplicates}
                  data-testid="settings-dupes"
                  label="Duplicate clause (Show alert on duplicate pokémon)"
                  onChange={() => appState.changeDupe()}
                />
                <Checkbox
                  checked={appState.nicknames}
                  data-testid="settings-nickname"
                  label="Show nicknames"
                  onChange={() => appState.toggleNickname()}
                />
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => setSettings(false)}>Close</Button>
              </Modal.Actions>
            </Modal>
            <Dropdown.Item icon="download" onClick={handleExport} text="Export" />
            <Dropdown.Item id="import">
              <Icon name="upload" />
              <input
                aria-labelledby="import"
                className={styles.input}
                id="file-input"
                onChange={handleImport}
                type="file"
              />
              Import
            </Dropdown.Item>
            <Dropdown.Item icon="linkify" onClick={handleRules} text="Rules" />
            {!!appState.selectedGame && <Share />}
            <Contact />
            <About />
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown
          aria-label="games"
          className={styles.gameSelect}
          data-testid="game-select"
          inline
          lazyLoad
          onChange={handleChange}
          options={appState.gamesList}
          placeholder="Choose a game"
          selection
          value={appState.selectedGame?.value ?? ''}
        />
        <Menu.Menu>
          <Modal
            closeOnDimmerClick
            open={open}
            trigger={
              <Button
                aria-label="addgame"
                className={styles.button}
                data-testid="add-game"
                icon
                onClick={() => setOpen(true)}
                style={{ boxShadow: 'none' }}
              >
                <Icon name="plus" />
              </Button>
            }
          >
            <Modal.Header>Add Game</Modal.Header>
            <Modal.Content style={{ display: 'flex', flexFlow: 'column nowrap', gap: '5px' }}>
              Please enter the game name
              <Input
                data-testid="add-game-input"
                onChange={(e, data) => setGameName(data.value)}
                value={gameName}
              />
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button disabled={gameName?.length === 0} onClick={handleAdd}>
                Save
              </Button>
            </Modal.Actions>
          </Modal>
          {appState.selectedGame?.value && Number(appState.selectedGame.value) > 13 ? (
            <Button
              aria-label="deletegame"
              className={styles.button}
              icon
              onClick={() => setConfirm(true)}
              style={{ boxShadow: 'none', padding: '2px', margin: 0 }}
            >
              <Icon name="trash" />
            </Button>
          ) : null}
          {appState.selectedGame?.value && Number(appState.selectedGame.value) <= 13 ? (
            <BadgeEditor />
          ) : null}
          <Confirm
            content="This will delete the custom game. Are you sure?"
            open={confirm}
            onCancel={() => setConfirm(false)}
            onConfirm={handleDelete}
          />
        </Menu.Menu>
        <Menu.Menu position="right">
          <Button
            aria-label="darkmode"
            className={styles.button}
            icon
            onClick={() => appState.toggleMode()}
          >
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
