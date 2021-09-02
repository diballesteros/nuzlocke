import React, { useCallback, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import useStore from 'store';
import { LEVEL_CAPS } from 'constants/badges';
import styles from './BadgeEditor.module.scss';

const MULTIPLE_CAPS = ['1', '3', '5', '8'];

const BadgeEditor: React.FC = () => {
  const [open, setOpen] = useState(false);
  const badges = useStore(useCallback((state) => state.badges, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const resetBadges = useStore(useCallback((state) => state.resetBadges, []));
  const editBadge = useStore(useCallback((state) => state.editBadge, []));

  const handleChange = (newBadge: string, index: number) => {
    editBadge(newBadge, index);
  };

  const handleMultiReset = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    resetBadges(data.value as string);
  };

  return (
    <Modal
      closeOnDimmerClick
      onClose={() => setOpen(false)}
      open={open}
      trigger={
        <Button
          aria-label="editgame"
          className={styles.button}
          data-testid="edit-badges"
          icon
          onClick={() => setOpen(true)}
          style={{ boxShadow: 'none', padding: '2px', margin: 0 }}
        >
          <Icon name="pencil" />
        </Button>
      }
    >
      <Modal.Header>Edit Badge Level Caps</Modal.Header>
      <Modal.Content
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          gap: '5px',
          maxHeight: '70vh',
          overflow: 'auto',
        }}
      >
        {badges[selectedGame?.value].map((val, i) => {
          return (
            <Input
              key={`badge-${i + 1}`}
              label={val.name}
              onChange={(e, data) => handleChange(data.value, i)}
              value={val.levelCap}
            />
          );
        })}
      </Modal.Content>
      <Modal.Actions>
        {MULTIPLE_CAPS.includes(selectedGame?.value) ? (
          <Dropdown
            button
            text="Set default"
            onChange={handleMultiReset}
            options={LEVEL_CAPS[selectedGame?.value]}
            value={null}
          />
        ) : (
          <Button onClick={() => resetBadges()}>Set default</Button>
        )}
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default BadgeEditor;
