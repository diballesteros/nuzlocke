import React, { useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Checkbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';

const Settings: React.FC = () => {
  const appState = useStore((state) => state);
  const [show, setShow] = useState(false);

  return (
    <Modal
      closeOnDimmerClick
      onClose={() => setShow(false)}
      open={show}
      trigger={<Dropdown.Item icon="options" onClick={() => setShow(true)} text="Settings" />}
    >
      <Modal.Header>Settings</Modal.Header>
      <Modal.Content style={{ display: 'flex', flexFlow: 'column nowrap', gap: '5px' }}>
        <Checkbox
          checked={appState.duplicates}
          data-testid="settings-dupes"
          label="Duplicate clause (Show alert on duplicate pokémon)"
          onChange={() => appState.changeDupe()}
        />
        <Checkbox
          checked={appState.nicknames}
          data-testid="settings-nickname"
          label="Show nicknames"
          onChange={() => appState.toggleNickname()}
        />
        <Checkbox
          checked={appState.missing}
          data-testid="settings-missing"
          label="Show only missing encounters"
          onChange={() => appState.toggleMissing()}
        />
        <Checkbox
          checked={appState.showAll}
          data-testid="settings-showall"
          label="Show all pokémon in every encounter"
          onChange={() => appState.toggleShowAll()}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setShow(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Settings;
