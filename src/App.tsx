import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Sidebar from 'semantic-ui-react/dist/commonjs/modules/Sidebar';
import useStore from 'store';
import { AppState } from 'constants/types';
import AppRouter from 'routes/AppRouter';
import { BadgeEditor, Contact, Effectiveness, Footer } from 'components';
import styles from './App.module.scss';

const App: React.FC = () => {
  const history = useHistory();
  const appState = useStore((state) => state);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [gameName, setGameName] = useState('');
  const [visible, setVisible] = useState(false);

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
        selectedGame: appState.selectedGame,
        team: appState.team,
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

  const handleRoute = (route: string) => {
    history.push(route);
  };

  return (
    <main className={styles.app}>
      <header>
        <Menu attached="top" inverted={appState.darkMode} style={{ width: '100%' }}>
          <button
            aria-label="sidebar-button"
            onClick={() => setVisible(!visible)}
            type="button"
            className={styles.sidebarButton}
            data-testid="options"
          >
            <Icon name="bars" />
            {appState.newVersion !== process.env.REACT_APP_VERSION && <span>!</span>}
          </button>
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
      <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          visible={visible}
          vertical
          inverted={appState.darkMode}
          animation="overlay"
          onHide={() => setVisible(false)}
          width="thin"
          aria-label="options"
        >
          <Menu.Item onClick={() => handleRoute('/')}>
            Tracker
            <Icon name="map" />
          </Menu.Item>
          <Menu.Item onClick={() => handleRoute('/rules')}>
            <Icon name="book" />
            Rules
          </Menu.Item>
          <Menu.Item onClick={() => handleRoute('/stats')}>
            <Icon name="pie graph" />
            Stats
          </Menu.Item>
          <Menu.Item onClick={() => handleRoute('/builder')}>
            <Icon name="gavel" />
            Builder
          </Menu.Item>
          <Menu.Item onClick={() => handleRoute('/settings')}>
            Settings
            <Icon name="wrench" />
          </Menu.Item>
          <Menu.Item onClick={handleExport}>
            <Icon name="download" />
            Export
          </Menu.Item>
          <Menu.Item id="import">
            <Icon name="upload" />
            <input
              aria-labelledby="import"
              className={styles.input}
              id="file-input"
              onChange={handleImport}
              type="file"
            />
            Import
          </Menu.Item>
          <Contact />
          <Menu.Item
            className={`${
              appState.newVersion !== process.env.REACT_APP_VERSION ? styles.newVersion : ''
            }`}
            data-testid="changelog"
            onClick={() => handleRoute('/changelog')}
          >
            Changelog
            {appState.newVersion !== process.env.REACT_APP_VERSION && <span>!</span>}
            <Icon name="clipboard outline" />
          </Menu.Item>
          <Menu.Item data-testid="about" onClick={() => handleRoute('/about')}>
            About
            <Icon name="question" />
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher>
          <div className={styles.grid}>
            <div className={styles.mainContent}>
              <AppRouter />
            </div>
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
      <Footer />
      <Effectiveness />
    </main>
  );
};

export default App;
