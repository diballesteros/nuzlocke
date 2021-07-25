import React, { useCallback, useState } from 'react';
import { Modal, Button, Icon, Input } from 'semantic-ui-react';
import useStore from 'store';
import styles from './BadgeEditor.module.scss';

const BadgeEditor: React.FC = () => {
  const [open, setOpen] = useState(false);
  const badges = useStore(useCallback((state) => state.badges, []));
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const resetBadges = useStore(useCallback((state) => state.resetBadges, []));
  const editBadge = useStore(useCallback((state) => state.editBadge, []));

  const handleChange = (newBadge: string, index: number) => {
    editBadge(newBadge, index);
  };

  const handleReset = () => {
    resetBadges();
  };

  return (
    <Modal
      closeOnDimmerClick
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
        <Button onClick={handleReset}>Reset</Button>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

BadgeEditor.propTypes = {};

export default BadgeEditor;
