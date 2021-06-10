import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tracker from 'components/Tracker/Tracker';
import Menu from '@material-ui/icons/Menu';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import styles from './App.module.scss';

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
