import React, { useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';
import CHANGELOG from 'constants/changelog';
import { TReleaseGroup } from 'constants/types';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import styles from './Changelog.module.scss';

const Changelog: React.FC = () => {
  const appState = useStore((state) => state);
  const [show, setShow] = useState(false);

  const handleAbout = () => {
    appState.removeNew();
    setShow(true);
  };

  const getClass = (type: TReleaseGroup) => {
    switch (type) {
      case 'FEATURE':
        return styles.feature;
      case 'FIX':
        return styles.fix;
      default:
        return styles.update;
    }
  };

  return (
    <Modal
      closeOnDimmerClick
      onClose={() => setShow(false)}
      open={show}
      trigger={
        <Menu.Item
          className={`${
            appState.newVersion !== process.env.REACT_APP_VERSION ? styles.newVersion : ''
          }`}
          onClick={handleAbout}
        >
          Changelog
          {appState.newVersion !== process.env.REACT_APP_VERSION && <span>!</span>}
          <Icon name="clipboard outline" />
        </Menu.Item>
      }
    >
      <Modal.Header>Changelog</Modal.Header>
      <Modal.Content
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          gap: '3px',
          maxHeight: '76vh',
        }}
      >
        <div className={styles.changelog}>
          {CHANGELOG.map((release, i) => {
            return (
              <React.Fragment key={`release-${i + 1}`}>
                <h4>
                  {release.name} <span>{new Date(release.date).toDateString()}</span>
                </h4>
                <ul>
                  {release.notes.map((note) => {
                    return (
                      <li key={note.description}>
                        <span className={`${styles.type} ${getClass(note.type)}`}>{note.type}</span>
                        {note.description}
                      </li>
                    );
                  })}
                </ul>
              </React.Fragment>
            );
          })}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setShow(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Changelog;
