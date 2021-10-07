import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Sidebar from 'semantic-ui-react/dist/commonjs/modules/Sidebar';
import { AddGame, Effectiveness, Export, Footer } from 'components';
import { BadgeEditor } from 'components/Badges/elements';
import AppRouter from 'routes/AppRouter';
import useStore from 'store';
import styles from './App.module.scss';

function App(): JSX.Element {
  const history = useHistory();
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const newVersion = useStore(useCallback((state) => state.newVersion, []));
  const gamesList = useStore(useCallback((state) => state.gamesList, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const toggleMode = useStore(useCallback((state) => state.toggleMode, []));
  const selectGame = useStore(useCallback((state) => state.selectGame, []));
  const deleteGame = useStore(useCallback((state) => state.deleteGame, []));
  const [confirm, setConfirm] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (darkMode) {
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
  }, [darkMode]);

  const handleChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const foundGame = gamesList.find((game) => game.value === data.value);
    selectGame(foundGame);
  };

  const handleDelete = () => {
    deleteGame();
    setConfirm(false);
    toast.success('Successfully deleted game');
  };

  const handleRoute = (route: string) => {
    history.push(route);
    setVisible(false);
  };

  return (
    <div className={styles.app} data-testid="app">
      <header>
        <Menu attached="top" inverted={darkMode} style={{ width: '100%' }}>
          <button
            aria-label="sidebar-button"
            onClick={() => setVisible(!visible)}
            type="button"
            className={styles.sidebarButton}
            data-testid="options"
          >
            <Icon name="bars" />
            {newVersion !== process.env.REACT_APP_VERSION && (
              <span className={styles.exclamation}>!</span>
            )}
          </button>
          <Dropdown
            aria-label="games"
            className={styles.gameSelect}
            data-testid="game-select"
            inline
            onChange={handleChange}
            options={gamesList}
            placeholder="Choose a game"
            selection
            value={selectedGame?.value ?? ''}
          />
          <Menu.Menu position="left">
            <AddGame />
            {selectedGame?.value && Number(selectedGame.value) > 13 ? (
              <Button
                aria-label="deletegame"
                className={`${styles.button} ${styles.delete}`}
                icon
                onClick={() => setConfirm(true)}
                style={{ boxShadow: 'none', margin: 0 }}
              >
                <Icon name="trash" />
              </Button>
            ) : null}
            <BadgeEditor />
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
              data-testid="darkmode"
              icon
              onClick={toggleMode}
            >
              <Icon name={darkMode ? 'sun outline' : 'sun'} />
            </Button>
          </Menu.Menu>
        </Menu>
      </header>
      <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          visible={visible}
          vertical
          inverted={darkMode}
          animation="overlay"
          onHide={() => setVisible(false)}
          width="thin"
          aria-label="options"
        >
          <Menu.Item data-testid="tracker" onClick={() => handleRoute('/')}>
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
          <Menu.Item data-testid="calculator" onClick={() => handleRoute('/calculator')}>
            <Icon name="calculator" />
            Damage Calculator
          </Menu.Item>
          <Menu.Item onClick={() => handleRoute('/settings')}>
            Settings
            <Icon name="wrench" />
          </Menu.Item>
          <Export />
          <Menu.Item data-testid="import" onClick={() => handleRoute('/import')}>
            <Icon name="upload" />
            Import
          </Menu.Item>
          <Menu.Item data-testid="report" onClick={() => handleRoute('/report')}>
            Report
            <Icon name="bug" />
          </Menu.Item>
          <Menu.Item data-testid="changelog" onClick={() => handleRoute('/changelog')}>
            Changelog
            {newVersion !== process.env.REACT_APP_VERSION && (
              <span className={styles.exclamation}>!</span>
            )}
            <Icon name="clipboard outline" />
          </Menu.Item>
          <Menu.Item data-testid="about" onClick={() => handleRoute('/about')}>
            About
            <Icon name="question" />
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher dimmed={visible}>
          <main className={styles.grid}>
            <nav className={styles.nav}>
              <NavLink activeClassName={styles.activeLink} exact to="/">
                <Icon name="map" /> <span>Tracker</span>
              </NavLink>
              <NavLink activeClassName={styles.activeLink} exact to="/rules">
                <Icon name="book" /> <span>Rules</span>
              </NavLink>
              <NavLink activeClassName={styles.activeLink} exact to="/stats">
                <Icon name="pie graph" /> <span>Stats</span>
              </NavLink>
              <NavLink activeClassName={styles.activeLink} exact to="/builder">
                <Icon name="gavel" /> <span>Builder</span>
              </NavLink>
            </nav>
            <div className={styles.mainContent}>
              <AppRouter />
            </div>
          </main>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
      <Footer />
      <Effectiveness />
      <ToastContainer
        limit={3}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        position="bottom-center"
        theme={darkMode ? 'dark' : 'light'}
      />
    </div>
  );
}

export default App;
