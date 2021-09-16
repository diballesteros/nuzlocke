import React, { useCallback, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';
import styles from 'assets/styles/Button.module.scss';

interface AddEncounterProps {
  icon?: boolean;
}

const AddEncounter: React.FC<AddEncounterProps> = ({ icon = false }) => {
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const addEncounter = useStore(useCallback((state) => state.addEncounter, []));
  const darkMode = useStore(useCallback((state) => state.darkMode, []));
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');

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
    <Modal
      closeOnDimmerClick
      onClose={handleClose}
      open={open}
      trigger={
        icon ? (
          <Button
            icon="plus"
            circular
            className={styles.iconButton}
            color="green"
            data-testid="add-encounter"
            disabled={!selectedGame}
            onClick={() => setOpen(true)}
          />
        ) : (
          <Button
            color="green"
            data-testid="add-encounter"
            disabled={!selectedGame}
            inverted={darkMode}
            onClick={() => setOpen(true)}
          >
            ADD
            <Icon className="icon plus" />
          </Button>
        )
      }
    >
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
  );
};

export default AddEncounter;
