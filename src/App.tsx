import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Confirm from 'semantic-ui-react/dist/commonjs/addons/Confirm';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Sidebar from 'semantic-ui-react/dist/commonjs/modules/Sidebar';
import { AddGame, Effectiveness, Export, Warning } from 'components';
import { BadgeEditor, CustomBadgeEditor } from 'components/Badges/elements';
import { MAX_GAME } from 'constants/constant';
import AppRouter from 'routes/AppRouter';
import useStore from 'store';
import styles from './App.module.scss';

function App(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const newVersion = useStore(useCallback((state) => state.newVersion, []));
  const gamesList = useStore(useCallback((state) => state.gamesList, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const toggleMode = useStore(useCallback((state) => state.toggleMode, []));
  const selectGame = useStore(useCallback((state) => state.selectGame, []));
  const deleteGame = useStore(useCallback((state) => state.deleteGame, []));
  const warning = useStore(useCallback((state) => state.warning, []));
  const [confirm, setConfirm] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (
      newVersion !== process.env.REACT_APP_VERSION &&
      window?.matchMedia('(prefers-color-scheme:dark)')?.matches
    ) {
      useStore.setState((state) => {
        state.darkMode = true;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.style.setProperty('--header', '#1b1c1d');
      document.documentElement.style.setProperty('--card', '#424242');
      document.documentElement.style.setProperty('--badge', '#C395FE');
      document.documentElement.style.setProperty('--badgeopac', '#C395FE50');
      document.documentElement.style.setProperty('--badgeflash', '#ffffff');
      document.documentElement.style.setProperty('--bgprimary', '#212121');
      document.documentElement.style.setProperty('--bgsecondary', '#333333');
      document.documentElement.style.setProperty('--contrast', '#FFFFFF');
      document.documentElement.style.setProperty('--placeholder', '#d9d9d9');
      document.documentElement.style.setProperty('--contrast-border', '#525252');
    } else {
      document.documentElement.style.setProperty('--header', '#ffffff');
      document.documentElement.style.setProperty('--card', '#ffffff');
      document.documentElement.style.setProperty('--bgprimary', '#FFFFFF');
      document.documentElement.style.setProperty('--badge', '#D46A6A');
      document.documentElement.style.setProperty('--badgeopac', '#D46A6A50');
      document.documentElement.style.setProperty('--badgeflash', '#ffaaaa');
      document.documentElement.style.setProperty('--bgsecondary', '#E2E1E0');
      document.documentElement.style.setProperty('--contrast', '#333333');
      document.documentElement.style.setProperty('--contrast-border', '#e5e5e5');
    }
  }, [darkMode]);

  const handleChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    const foundGame = gamesList.find((game) => game.value === data.value);
    selectGame(foundGame);
  };

  const handleDelete = () => {
    deleteGame();
    setConfirm(false);
    toast.success(t('delete_success'));
  };

  const handleRoute = (route: string) => {
    navigate(route);
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
            placeholder={t('choose_a_game')}
            selection
            value={selectedGame?.value ?? ''}
          />
          <Menu.Menu position="left">
            <AddGame />
            {selectedGame?.value && Number(selectedGame.value) > MAX_GAME ? (
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
            <CustomBadgeEditor />
            <Confirm
              closeOnDimmerClick
              content={t('delete_custom')}
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
            {/* <Button
              aria-label="darkmode"
              className={`${styles.button} ${styles.darkmode}`}
              data-testid="darkmode"
              icon
              onClick={toggleMode}
            >
              <Icon name="user" />
            </Button> */}
          </Menu.Menu>
        </Menu>
      </header>
      <Sidebar.Pushable>
        <Sidebar
          animation="overlay"
          aria-label="sidebar-options"
          as={Menu}
          className={styles.sidebar}
          inverted={darkMode}
          onHide={() => setVisible(false)}
          vertical
          visible={visible}
          width="thin"
        >
          <Menu.Item as="div" data-testid="tracker" onClick={() => handleRoute('/')}>
            Tracker
            <Icon name="map" />
          </Menu.Item>
          <Menu.Item as="div" onClick={() => handleRoute('/rules')}>
            <Icon name="book" />
            {t('rules', { ns: 'stats' })}
          </Menu.Item>
          <Menu.Item as="div" data-testid="stats" onClick={() => handleRoute('/stats')}>
            <Icon name="pie graph" />
            {t('stats', { ns: 'stats' })}
          </Menu.Item>
          <Menu.Item as="div" data-testid="builder" onClick={() => handleRoute('/builder')}>
            <Icon name="gavel" />
            Builder
          </Menu.Item>
          <Menu.Item as="div" data-testid="calculator" onClick={() => handleRoute('/calculator')}>
            <Icon name="calculator" />
            {t('damage_calculator')}
          </Menu.Item>
          <Menu.Item as="div" onClick={() => handleRoute('/settings')}>
            {t('settings', { ns: 'settings' })}
            <Icon name="wrench" />
          </Menu.Item>
          <Export />
          <Menu.Item as="div" data-testid="import" onClick={() => handleRoute('/import')}>
            <Icon name="upload" />
            {t('import', { ns: 'import' })}
          </Menu.Item>
          <Menu.Item as="div" data-testid="report" onClick={() => handleRoute('/report')}>
            {t('report')}
            <Icon name="bug" />
          </Menu.Item>
          <Menu.Item as="div" data-testid="changelog" onClick={() => handleRoute('/changelog')}>
            Changelog
            {newVersion !== process.env.REACT_APP_VERSION && (
              <span className={styles.exclamation}>!</span>
            )}
            <Icon name="clipboard outline" />
          </Menu.Item>
          <Menu.Item as="div" data-testid="about" onClick={() => handleRoute('/about')}>
            {t('about', { ns: 'about' })}
            <Icon name="question" />
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher dimmed={visible}>
          <main className={styles.grid}>
            <nav className={styles.nav}>
              <NavLink className={({ isActive }) => (isActive ? styles.activeLink : '')} end to="/">
                <Icon name="map" /> <span>Tracker</span>
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? styles.activeLink : '')}
                end
                to="/rules"
              >
                <Icon name="book" /> <span>{t('rules', { ns: 'stats' })}</span>
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? styles.activeLink : '')}
                end
                to="/stats"
              >
                <Icon name="pie graph" /> <span>{t('stats', { ns: 'stats' })}</span>
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? styles.activeLink : '')}
                end
                to="/builder"
              >
                <Icon name="gavel" /> <span>Builder</span>
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? styles.activeLink : '')}
                end
                to="/calculator"
              >
                <Icon name="calculator" /> <span>{t('calculator')}</span>
              </NavLink>
            </nav>
            <div className={styles.mainContent}>
              <AppRouter />
            </div>
          </main>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
      <footer className={`${styles.footer} ${visible ? styles.hide : ''}`}>
        Pokémon © 2002-2021 Pokémon <br />© 1995-2021 Nintendo/Creatures Inc./GAME FREAK inc. TM,
        <br />® and Pokémon character names are trademarks of Nintendo.
      </footer>
      <Effectiveness />
      {!warning && <Warning />}
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
