import React, { useEffect, useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tracker from 'components/Tracker/Tracker';
import Menu from '@material-ui/icons/Menu';
import Brightness4 from '@material-ui/icons/Brightness4';
import Brightness7 from '@material-ui/icons/Brightness7';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import useStore from 'store';
import styles from './App.module.scss';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);
  const mode = useStore((state) => state.darkMode);
  const toggleMode = useStore((state) => state.toggleMode);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (mode) {
      document.documentElement.style.setProperty('--app', '#333333');
      document.documentElement.style.setProperty('--primary', '#666666');
      document.documentElement.style.setProperty('--secondary', '#FFE8E8');
      document.documentElement.style.setProperty('--bgprimary', '#212121');
      document.documentElement.style.setProperty('--bgsecondary', '#333333');
      document.documentElement.style.setProperty('--contrast', '#FFFFFF');
    } else {
      document.documentElement.style.setProperty('--app', '#801515');
      document.documentElement.style.setProperty('--primary', '#D46A6A');
      document.documentElement.style.setProperty('--secondary', '#FFE8E8');
      document.documentElement.style.setProperty('--bgprimary', '#FFFFFF');
      document.documentElement.style.setProperty('--bgsecondary', '#F5F5F5');
      document.documentElement.style.setProperty('--contrast', '#333333');
    }
  }, [mode]);

  return (
    <div className={styles.app}>
      <AppBar className={`${styles.appBar} ${open ? styles.appBarShift : ''}`}>
        <Toolbar>
          {!open && (
            <IconButton
              aria-label="open drawer"
              color="inherit"
              className={styles.menuIcon}
              onClick={handleOpen}
              edge="start"
            >
              <Menu />
            </IconButton>
          )}
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
      <Drawer
        variant="permanent"
        className={`${styles.drawer} ${open ? styles.open : styles.close}`}
        classes={{ paper: open ? styles.open : styles.close }}
      >
        <div className={styles.arrowContainer}>
          <IconButton onClick={handleClose}>
            <ArrowBackIos />
          </IconButton>
        </div>
      </Drawer>
      <main className={styles.main}>
        <Tracker />
      </main>
    </div>
  );
};

export default App;
