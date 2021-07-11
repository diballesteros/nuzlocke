import React, { useCallback, useEffect, useState } from 'react';
import { Button, Icon, Input, Modal } from 'semantic-ui-react';
import useStore from 'store';
import useDebounce from 'hooks/useDebounce';
import styles from './Options.module.scss';

const Options: React.FC = React.memo(() => {
  const text = useStore(useCallback((state) => state.text, []));
  const search = useStore(useCallback((state) => state.search, []));
  const resetAll = useStore(useCallback((state) => state.resetAll, []));
  const addEncounter = useStore(useCallback((state) => state.addEncounter, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const [searchText, setSearchText] = useState(text);
  const debouncedValue = useDebounce<string>(searchText, 250);
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');

  useEffect(() => {
    search(debouncedValue);
  }, [debouncedValue, search]);

  const handleReset = () => {
    resetAll();
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
        className={styles.search}
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
        <Modal
          closeOnDimmerClick
          open={open}
          trigger={
            <Button color="green" inverted={darkMode} onClick={() => setOpen(true)}>
              ADD ENCOUNTER
              <i className="icon plus" />
            </Button>
          }
        >
          <Modal.Header>Add Encounter</Modal.Header>
          <Modal.Content style={{ display: 'flex', flexFlow: 'column nowrap', gap: '5px' }}>
            Please enter the location name
            <Input onChange={(e, data) => setLocation(data.value)} value={location} />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button disabled={location?.length === 0} onClick={handleAdd}>
              Save
            </Button>
          </Modal.Actions>
        </Modal>
        <Button color="red" inverted={darkMode} onClick={handleReset}>
          RESET ALL
          <i className="icon close" />
        </Button>
      </div>
    </div>
  );
});

export default Options;
