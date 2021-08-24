import React, { useEffect, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';
import Container from 'semantic-ui-react/dist/commonjs/elements/Container';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import useStore from 'store';
import { AppState } from 'constants/types';
import { About, BadgeEditor, Contact, Pokestats, Rules, Settings, Tracker } from 'components';
import styles from './App.module.scss';

const App: React.FC = () => {
  const appState = useStore((state) => state);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [gameName, setGameName] = useState('');

  const panes = [
    {
      menuItem: 'Tracker',
      render: () => (
        <Tab.Pane>
          <Tracker />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Rules',
      render: () => (
        <Tab.Pane>
          <Rules />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'PokéStats',
      render: () => (
        <Tab.Pane>
          <Pokestats />
        </Tab.Pane>
      ),
    },
  ];

  useEffect(() => {
    if (appState.darkMode) {
      document.documentElement.style.setProperty('--header', '#1b1c1d');
      document.documentElement.style.setProperty('--card', '#424242');
      document.documentElement.style.setProperty('--badge', '#C395FE');
      document.documentElement.style.setProperty('--badgeflash', '#ffffff');
      document.documentElement.style.setProperty('--bgprimary', '#212121');
      document.documentElement.style.setProperty('--bgsecondary', '#333333');
      document.documentElement.style.setProperty('--contrast', '#FFFFFF');
    } else {
      document.documentElement.style.setProperty('--header', '#ffffff');
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
        games: appState.games,
        gamesList: appState.gamesList,
        rules: appState.rules,
        rulesets: appState.rulesets,
        selectedGame: appState.selectedGame,
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

  const handleDelete = () => {
    appState.deleteGame();
    setConfirm(false);
  };

  return (
    <main className={styles.app}>
      <header>
        <Menu attached="top" inverted={appState.darkMode} style={{ width: '100%' }}>
          <Dropdown
            aria-label="options"
            className={styles.dropdown}
            data-testid="options"
            icon="bars"
            item
            simple
            text={appState.newVersion !== '3.2.1' ? '!' : undefined}
          >
            <Dropdown.Menu>
              <Settings />
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
              <Contact />
              <About />
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            aria-label="games"
            className={styles.gameSelect}
            data-testid="game-select"
            inline
            onChange={handleChange}
            options={appState.gamesList}
            placeholder="Choose a game"
            selection
            value={appState.selectedGame?.value ?? ''}
          />
          <Menu.Menu position="left">
            <Modal
              closeOnDimmerClick
              onClose={handleClose}
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
              closeOnDimmerClick
              content="This will delete the custom game. Are you sure?"
              open={confirm}
              onCancel={() => setConfirm(false)}
              onConfirm={handleDelete}
            />
          </Menu.Menu>
          <Menu.Menu className={styles.header}>
            <h1>Nuzlocke Tracker</h1>
          </Menu.Menu>
          <Menu.Menu position="right">
            <Button
              aria-label="darkmode"
              className={`${styles.button} ${styles.darkmode}`}
              icon
              onClick={() => appState.toggleMode()}
            >
              <Icon name={appState.darkMode ? 'sun outline' : 'sun'} />
            </Button>
          </Menu.Menu>
        </Menu>
      </header>
      <Container className={styles.container}>
        <Tab className={styles.tabs} panes={panes} />
      </Container>
      <footer className={styles.footer}>
        <b className={styles.name}>Nuzlocke Tracker</b>
        <span className={styles.pokemon}>
          Pokémon © 2002-2021 Pokémon. © 1995-2021 Nintendo/Creatures Inc./GAME FREAK inc. TM, ® and
          Pokémon character names are trademarks of Nintendo.
        </span>
        <div className={styles.socials}>
          <a
            className={styles.github}
            data-show-count="false"
            href="https://twitter.com/relatablecoder?ref_src=twsrc%5Etfw"
          >
            <Icon name="twitter square" />
            <span>Follow</span>
          </a>
          <a
            className={styles.github}
            href="https://github.com/diballesteros/nuzlocke/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="github" />
            <span>Source</span>
          </a>
          <a
            className={styles.github}
            href="https://www.patreon.com/diballesteros"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="patreon" />
            <span>Support</span>
          </a>
        </div>
      </footer>
    </main>
  );
};

export default App;
