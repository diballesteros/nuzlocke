import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
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
  const [openTwo, setOpenTwo] = useState(false);
  const [settings, setSettings] = useState(false);
  const [share, setShare] = useState(false);
  const [gameName, setGameName] = useState('');
  const shareRef = useRef<HTMLTextAreaElement>(null);

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

  const handleGithub = () => {
    window.open('https://github.com/diballesteros/nuzlocke/', '_blank');
  };

  const handleRules = () => {
    window.open('https://bulbapedia.bulbagarden.net/wiki/Nuzlocke_Challenge', '_blank');
  };

  const handleCopy = () => {
    shareRef.current.select();
    document.execCommand('copy');
  };

  return (
    <main className={styles.app}>
      <Menu attached="top" inverted={appState.darkMode} style={{ width: '100%' }}>
        <Dropdown aria-label="options" item icon="wrench" simple>
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
                  label="Duplicate clause (Show alert on duplicate pokémon)"
                  onChange={() => appState.changeDupe()}
                  checked={appState.duplicates}
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
            <Modal
              closeOnDimmerClick
              open={share}
              trigger={<Dropdown.Item icon="share" onClick={() => setShare(true)} text="Share" />}
            >
              <Modal.Header>Share</Modal.Header>
              <Modal.Content
                style={{
                  display: 'flex',
                  flexFlow: 'column nowrap',
                  gap: '5px',
                  maxHeight: '80vh',
                  overflow: 'auto',
                }}
              >
                <textarea
                  ref={shareRef}
                  value={appState.games[appState?.selectedGame?.value].encounters.reduce(
                    (str, enc) => {
                      return `${str}
                  ${enc.location} - ${enc.pokemon?.text || 'N/A'} - ${enc.status?.text || 'N/A'}`;
                    },
                    `Nuzlocke Encounter List
                    `
                  )}
                />
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={handleCopy}>Copy</Button>
                <Button onClick={() => setShare(false)}>Close</Button>
              </Modal.Actions>
            </Modal>
            <Modal
              closeOnDimmerClick
              open={openTwo}
              trigger={
                <Dropdown.Item icon="question" onClick={() => setOpenTwo(true)} text="About" />
              }
            >
              <Modal.Header>About</Modal.Header>
              <Modal.Content style={{ display: 'flex', flexFlow: 'column nowrap', gap: '5px' }}>
                <b>This web app uses local cache to maintain your pokémon!</b>
                <br />
                <span>Credits:</span>Pokémon © 2002-2021 Pokémon. © 1995-2021 Nintendo/Creatures
                Inc./GAME FREAK inc. TM, ® and Pokémon character names are trademarks of Nintendo.
                <Button
                  aria-label="github"
                  basic
                  circular
                  icon
                  onClick={handleGithub}
                  style={{
                    width: 50,
                    height: 50,
                    fontSize: '32px',
                    padding: 0,
                    alignSelf: 'center',
                  }}
                >
                  <Icon name="github" />
                </Button>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => setOpenTwo(false)}>Close</Button>
              </Modal.Actions>
            </Modal>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown
          aria-label="games"
          className={styles.gameSelect}
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
