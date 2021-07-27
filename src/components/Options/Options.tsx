import React, { useCallback, useEffect, useState } from 'react';
import { Button, Confirm, Icon, Input, Modal } from 'semantic-ui-react';
import useStore from 'store';
import useDebounce from 'hooks/useDebounce';
import { Share } from 'components';
import styles from './Options.module.scss';

const Options: React.FC = React.memo(() => {
  const text = useStore(useCallback((state) => state.text, []));
  const search = useStore(useCallback((state) => state.search, []));
  const resetAll = useStore(useCallback((state) => state.resetAll, []));
  const addEncounter = useStore(useCallback((state) => state.addEncounter, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const games = useStore(useCallback((state) => state.games, []));
  const [searchText, setSearchText] = useState(text);
  const debouncedValue = useDebounce<string>(searchText, 250);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [location, setLocation] = useState('');

  useEffect(() => {
    search(debouncedValue);
  }, [debouncedValue, search]);

  const handleReset = () => {
    resetAll();
    setConfirm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleAdd = () => {
    addEncounter(location);
    setOpen(false);
    setLocation('');
  };

  const handleClose = () => {
    setOpen(false);
    setLocation('');
  };

  return (
    <div className={styles.options}>
      <Input
        aria-label="search"
        className={styles.search}
        disabled={!selectedGame}
        fluid
        icon
        id="search-filter"
        inverted={darkMode}
        onChange={handleChange}
        placeholder="Filter encounters..."
        type="search"
        value={searchText}
      >
        <input />
        <Icon name="search" />
      </Input>
      <div className={styles.buttons}>
        <Share
          disabled={!selectedGame}
          text={games[selectedGame?.value]?.encounters?.reduce(
            (str, enc) => {
              return `${str}
      ${enc.location} - ${enc.pokemon?.text || 'N/A'} - ${enc.status?.text || 'N/A'}`;
            },
            `Nuzlocke Encounter List
        `
          )}
        />
        <Modal
          closeOnDimmerClick
          open={open}
          trigger={
            <Button
              color="green"
              data-testid="add-encounter"
              disabled={!selectedGame}
              inverted={darkMode}
              onClick={() => setOpen(true)}
            >
              ADD ENCOUNTER
              <i className="icon plus" />
            </Button>
          }
        >
          <Modal.Header>Add Encounter</Modal.Header>
          <Modal.Content style={{ display: 'flex', flexFlow: 'column nowrap', gap: '5px' }}>
            Please enter the location name
            <Input
              data-testid="add-encounter-input"
              onChange={(e, data) => setLocation(data.value)}
              value={location}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button disabled={location?.length === 0} onClick={handleAdd}>
              Save
            </Button>
          </Modal.Actions>
        </Modal>
        <Button
          color="red"
          data-testid="reset-all"
          disabled={!selectedGame}
          inverted={darkMode}
          onClick={() => setConfirm(true)}
        >
          RESET
          <i className="icon close" />
        </Button>
        <Confirm
          content="This will reset all encounters for the selected game and delete custom encounters. Are you sure?"
          open={confirm}
          onCancel={() => setConfirm(false)}
          onConfirm={handleReset}
        />
      </div>
    </div>
  );
});

export default Options;
