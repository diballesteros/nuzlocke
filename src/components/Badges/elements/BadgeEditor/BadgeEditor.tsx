import React, { useCallback, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Dropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { LEVEL_CAPS } from 'constants/badges';
import useStore from 'store';
import buttonStyles from 'assets/styles/Button.module.scss';
import styles from './BadgeEditor.module.scss';

const MULTIPLE_CAPS = ['1', '3', '5', '8'];

interface BadgeEditorProps {
  icon?: boolean;
}

function BadgeEditor({ icon }: BadgeEditorProps): JSX.Element {
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

  return selectedGame?.value && Number(selectedGame.value) <= 13 ? (
    <Modal
      closeOnDimmerClick
      onClose={() => setOpen(false)}
      open={open}
      trigger={
        icon ? (
          <Button
            icon="pencil"
            circular
            className={buttonStyles.iconButton}
            color="yellow"
            data-testid="edit-badges"
            disabled={!selectedGame}
            onClick={() => setOpen(true)}
          />
        ) : (
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
        )
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
        {selectedGame &&
          badges[selectedGame?.value]?.map((val, i) => {
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
            data-testid="badge-multiple-default"
            onChange={handleMultiReset}
            options={LEVEL_CAPS[selectedGame?.value]}
            text="Set default"
            value={null}
          />
        ) : (
          <Button onClick={() => resetBadges()}>Set default</Button>
        )}
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  ) : null;
}

export default BadgeEditor;
