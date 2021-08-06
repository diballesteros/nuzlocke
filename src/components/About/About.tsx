import React, { useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';
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
        <Dropdown.Item
          className={`${appState.newVersion !== '2.7.0' ? styles.newVersion : ''}`}
          icon="question"
          onClick={handleAbout}
          text={`About ${appState.newVersion !== '2.7.0' ? '(NEW)' : ''}`}
        />
      }
    >
      <Modal.Header>About</Modal.Header>
      <Modal.Content
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          gap: '5px',
          maxHeight: '70vh',
        }}
      >
        <b>Changelog</b>
        <div style={{ overflow: 'auto' }}>
          <b>(Version 2.7.0)</b>
          <ul>
            <li>
              Encounters now show accurate droptables, this can be turned off from <b>Settings</b>{' '}
              by showing all pokémon. <b>**IMPORTANT**</b> In order to enable this in existing apps
              use the <b>Reset Button</b> Note this will delete existing encounter data.
            </li>
            <li>
              Set Pokemon Yellow, Emerald, Platinum, Black/White 2 different level caps from the
              <b> pencil</b> next to the game selector. In the emerging window, select an option
              from <b>Set Default</b>
            </li>
          </ul>
          <b>(Version 2.6.0)</b>
          <ul>
            <li>
              Show only missing encounters by enabling the option in <b>Settings</b>
            </li>
            <li>Edit already created rules</li>
            <li>Now works offline!</li>
          </ul>
          <b>(Version 2.5.0)</b>
          <ul>
            <li>Share option is now a button inside the tracker</li>
            <li>
              New <b>Team</b> option in <b>Status</b> of pokémon. This links to the new Pokéstats
              Tab!
            </li>
            <li>
              Rules Tab - Create, edit and share custom rulesets for your nuzlocke or use some
              popular defaults
            </li>
            <li>
              PokéStats Tab - At a glance view of all captured, fainted, in-team, and failed to
              captured pokémon. Click on the pokémon to see more details!
            </li>
            <li>Duplicate pokémon alert no longer shows up on failed encounters</li>
          </ul>
          <b>(Version 2.4.0)</b>
          <ul>
            <li>More options to better report a bug or suggest a feature</li>
            <li>Disabled inputs and placeholder if no game is selected</li>
            <li>Sword and Shield edit level caps</li>
            <li>Custom game Reset all fix</li>
          </ul>
          <b>(Version 2.3.0)</b>
          <ul>
            <li>Report a bug or suggestion option!</li>
            <li>Edit level caps for base games - from the pencil next to the game select</li>
            <li>Nickname option for encounters - can be found in Settings</li>
            <li>Yellow level cap adjustments</li>
            <li>Several bug fixes related to eliminating encounter locations</li>
          </ul>
          <b>(Version 2.2.0)</b>
          <ul>
            <li>BW2 Easy/Normal/Challenge mode level caps - separated by slashes</li>
            <li>HGSS and GSC Level caps up till Red</li>
            <li>New share option for copy and pasting</li>
            <li>New settings option to enable duplicate clause - alerts on dupes!</li>
            <li>
              SWSH encounters/level caps bug fix - if it still does not appear please delete site
              cache from your browser (IMPORTANT this will delete your other encounters saved on the
              site)
            </li>
          </ul>
        </div>
        <div className={styles.credits}>
          <b>Credits:</b>
          <div>
            Icons made by{' '}
            <a href="http://www.dariusdan.com" title="Darius Dan">
              Darius Dan
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
          <div>
            Icons made by{' '}
            <a href="http://www.roundicons.com" title="Roundicons Freebies">
              Roundicons Freebies
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
          <div>
            Icons made by{' '}
            <a href="https://www.flaticon.com/authors/nikita-golubev" title="Nikita Golubev">
              Nikita Golubev
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
          <div>
            Icons made by{' '}
            <a href="https://www.freepik.com" title="Freepik">
              Freepik
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setShow(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default About;
