import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tracker from 'components/Tracker/Tracker';
import Brightness4 from '@material-ui/icons/Brightness4';
import Brightness7 from '@material-ui/icons/Brightness7';
import useStore from 'store';
import styles from './App.module.scss';

const App: React.FC = () => {
  const mode = useStore((state) => state.darkMode);
  const toggleMode = useStore((state) => state.toggleMode);

  useEffect(() => {
    if (mode) {
      document.documentElement.style.setProperty('--app', '#333333');
      document.documentElement.style.setProperty('--primary', '#666666');
      document.documentElement.style.setProperty('--secondary', '#333333');
      document.documentElement.style.setProperty('--badge', '#C395FE');
      document.documentElement.style.setProperty('--badgeflash', '#ffffff');
      document.documentElement.style.setProperty('--bgprimary', '#212121');
      document.documentElement.style.setProperty('--bgsecondary', '#333333');
      document.documentElement.style.setProperty('--contrast', '#FFFFFF');
    } else {
      document.documentElement.style.setProperty('--app', '#801515');
      document.documentElement.style.setProperty('--primary', '#D46A6A');
      document.documentElement.style.setProperty('--secondary', '#FFE8E8');
      document.documentElement.style.setProperty('--bgprimary', '#FFFFFF');
      document.documentElement.style.setProperty('--badge', '#D46A6A');
      document.documentElement.style.setProperty('--badgeflash', '#ffaaaa');
      document.documentElement.style.setProperty('--bgsecondary', '#F5F5F5');
      document.documentElement.style.setProperty('--contrast', '#333333');
    }
  }, [mode]);

  return (
    <div className={styles.app}>
      <AppBar className={styles.appBar}>
        <Toolbar>
          <h1>Nuzlocke Tracker</h1>
          <IconButton
            aria-label="Dark mode"
            className={styles.darkIcon}
            color="inherit"
            onClick={() => toggleMode()}
          >
            {mode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <main className={styles.main}>
        <Tracker />
      </main>
      <footer className={styles.footer}>
        Pokémon © 2002-2021 Pokémon. © 1995-2021 Nintendo/Creatures Inc./GAME FREAK inc. TM, ® and
        Pokémon character names are trademarks of Nintendo.
      </footer>
    </div>
  );
};

export default App;
