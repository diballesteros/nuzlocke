import React, { useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';
import { ReactComponent as MicrosoftSVG } from 'assets/svg/English_get.svg';
import kofi from 'assets/img/kofi2.png';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import styles from './About.module.scss';

const About: React.FC = () => {
  const appState = useStore((state) => state);
  const [show, setShow] = useState(false);

  const handleAbout = () => {
    appState.removeNew();
    setShow(true);
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
          icon="question"
          onClick={handleAbout}
          text={`About ${appState.newVersion !== process.env.REACT_APP_VERSION ? '(NEW)' : ''}`}
        >
          About
          <Icon name="question" />
        </Menu.Item>
      }
    >
      <Modal.Header>About</Modal.Header>
      <Modal.Content
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          gap: '3px',
          maxHeight: '76vh',
        }}
      >
        <ul className={styles.credits}>
          <h3>Credits:</h3>
          <li>
            Images provided by{' '}
            <a href="https://bulbapedia.bulbagarden.net/wiki/Main_Page" title="Bulbapedia">
              Bulbapedia
            </a>
          </li>
          <li>
            Icons made by{' '}
            <a href="http://www.dariusdan.com" title="Darius Dan">
              Darius Dan
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </li>
          <li>
            Icons made by{' '}
            <a href="http://www.roundicons.com" title="Roundicons Freebies">
              Roundicons Freebies
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </li>
          <li>
            Icons made by{' '}
            <a href="https://www.flaticon.com/authors/nikita-golubev" title="Nikita Golubev">
              Nikita Golubev
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </li>
          <li>
            Icons made by{' '}
            <a href="https://www.freepik.com" title="Freepik">
              Freepik
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </li>
          <li>
            Icons made by{' '}
            <a href="https://www.flaticon.com/authors/vectors-market" title="Vectors Market">
              Vectors Market
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </li>
          <li>
            Nickname list provided by{' '}
            <a href="https://www.findnicknames.com/pokemon-nicknames/" title="findnicknames">
              Find Nicknames
            </a>
          </li>
        </ul>
        <div className={styles.support}>
          <a href="https://ko-fi.com/X8X05XBDC" rel="noreferrer" target="_blank">
            <img style={{ border: 0, height: 36 }} src={kofi} alt="Buy Me a Coffee at ko-fi.com" />
          </a>
          <a
            className={styles.patron}
            href="https://www.patreon.com/bePatron?u=60585540"
            rel="noreferrer"
            target="_blank"
          >
            Become a Patron!
          </a>
        </div>
        <div className={styles.stores}>
          <a
            href="//www.microsoft.com/store/apps/9PCM3Z3K0FTG?cid=storebadge&ocid=badge"
            rel="noreferrer"
            target="_blank"
          >
            <MicrosoftSVG className={styles.microsoft} />
          </a>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setShow(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default About;
